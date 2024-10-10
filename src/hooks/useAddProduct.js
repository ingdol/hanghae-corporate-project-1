import { useMutation } from "@tanstack/react-query";
import { addProductAPI } from "@/api/product";
import useToastStore from "@/store/toast/useToastStore";

export const useAddProduct = () => {
  const { showToast } = useToastStore();
  return useMutation({
    mutationFn: (productData) => addProductAPI(productData),
    onSuccess: (newProduct) => {
      console.log("Product added successfully", newProduct);
      showToast("상품이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("Error adding product", error);
    },
  });
};
