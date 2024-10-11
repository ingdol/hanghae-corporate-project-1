import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALL_CATEGORY_ID, categories } from "@/constants";
import React, { useState } from "react";
import { createNewProduct, initialProductState } from "@/helpers/product";
import { uploadImage } from "@/utils/imageUpload";
import { useAddProduct } from "@/hooks/useAddProduct";
import { Controller, useForm } from "react-hook-form";

export const ProductRegistrationModal = ({
  isOpen,
  onClose,
  onProductAdded,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: initialProductState,
  });
  const productMutation = useAddProduct();
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const onSubmit = async (data) => {
    console.log("클릭", data);
    try {
      if (!imageFile) {
        setError("image", {
          type: "manual",
          message: "이미지를 선택해야 합니다.",
        });
        return;
      }

      const imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      const newProduct = createNewProduct(data, imageUrl);
      productMutation.mutate(newProduct);
      onClose();
      onProductAdded();
    } catch (error) {
      console.error("물품 등록에 실패했습니다.", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Input
              {...register("title", { required: "상품명을 입력해주세요." })}
              placeholder="상품명"
              errors={errors}
            />
            <Input
              {...register("price", { required: "가격을 입력해주세요." })}
              type="number"
              placeholder="가격"
              errors={errors}
            />
            <Textarea
              {...register("description", {
                required: "상품 설명을 입력해주세요.",
              })}
              className="resize-none"
              placeholder="상품 설명"
              errors={errors}
            />
            <Controller
              name="category.id"
              control={control}
              rules={{ required: "카테고리를 선택해주세요." }}
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((category) => category.id !== ALL_CATEGORY_ID)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.category?.id && (
                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                      {errors.category.id.message}
                    </p>
                  )}
                </>
              )}
            />
            <Controller
              name="image"
              control={control}
              rules={{
                required: "파일을 선택해주세요.",
              }}
              render={({ field }) => (
                <>
                  <Input
                    className="cursor-pointer"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      field.onChange(e.target.files);
                    }}
                  />
                  {errors?.image && (
                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                      {errors?.image?.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
