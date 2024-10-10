import { useMutation } from "@tanstack/react-query";
import { addProductAPI } from "@/api/product";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: (productData) => addProductAPI(productData),
    onSuccess: (newProduct) => {
      console.log("Product added successfully", newProduct);
    },
    onError: (error) => {
      console.error("Error adding product", error);
    },
  });
};
