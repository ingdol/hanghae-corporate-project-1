import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { pageRoutes } from "@/apiRoutes";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { useModal } from "@/hooks/useModal";
import { FirebaseIndexErrorModal } from "@/pages/error/components/FirebaseIndexErrorModal";
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";
import { EmptyProduct } from "./EmptyProduct";
import { ProductCard } from "./ProductCard";
import { ProductRegistrationModal } from "./ProductRegistrationModal";
import useFilterStore from "@/store/filter/useFilterStore";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/product";
import useProductStore from "@/store/product/useProductStore";
import useAuthStore from "@/store/auth/useAuthStore";
import useCartStore from "@/store/cart/useCartStore";
import { extractIndexLink, isFirebaseIndexError } from "@/helpers/error";

export const ProductList = ({ pageSize = PRODUCT_PAGE_SIZE }) => {
  const navigate = useNavigate();
  const { addCartItem } = useCartStore();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] = useState(false);
  const [indexLink, setIndexLink] = useState(null);

  const filter = useMemo(() => {
    const { minPrice, maxPrice, title, categoryId } = useFilterStore.getState();
    return { minPrice, maxPrice, title, categoryId };
  }, [
    useFilterStore((state) => state.minPrice),
    useFilterStore((state) => state.maxPrice),
    useFilterStore((state) => state.title),
    useFilterStore((state) => state.categoryId),
  ]);

  const { user, isLogin } = useAuthStore();
  const {
    products,
    hasNextPage,
    totalCount,
    setProducts,
    setHasNextPage,
    setTotalCount,
  } = useProductStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", currentPage, filter],
    queryFn: () => fetchProducts(filter, pageSize, currentPage),
  });

  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        error instanceof Error ? isError.message : String(isError);

      if (isFirebaseIndexError(errorMessage)) {
        const link = extractIndexLink(errorMessage);
        setIndexLink(link);
        setIsIndexErrorModalOpen(true);
      } else {
        console.error("Unhandled error:", errorMessage);
      }
    }
  }, [isError, error]);

  const handleCartAction = useCallback(
    (product) => {
      if (isLogin && user) {
        const cartItem = { ...product, count: 1 };
        addCartItem({ item: cartItem, userId: user.uid, count: 1 });
        console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [isLogin, user?.uid, addCartItem]
  );

  const handlePurchaseAction = useCallback(
    (product) => {
      if (isLogin && user) {
        const cartItem = { ...product, count: 1 };
        addCartItem({ item: cartItem, userId: user.uid, count: 1 });
        navigate(pageRoutes.cart);
      } else {
        navigate(pageRoutes.login);
      }
    },
    [isLogin, user?.uid, addCartItem]
  );

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleProductAdded = () => {
    setCurrentPage(1);
  };

  const firstProductImage = products[0]?.image;

  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
      setHasNextPage(data.hasNextPage);
      setTotalCount(data.totalCount);
      setCurrentPage(currentPage);
    }
  }, [data, setProducts, setHasNextPage, setTotalCount, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          {isLogin && (
            <Button onClick={openModal}>
              <Plus className="mr-2 h-4 w-4" /> 상품 등록
            </Button>
          )}
        </div>

        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard
                  key={`${product.id}_${index}`}
                  product={product}
                  onClickAddCartButton={(e) => {
                    e.stopPropagation();
                    handleCartAction(product);
                  }}
                  onClickPurchaseButton={(e) => {
                    e.stopPropagation();
                    handlePurchaseAction(product);
                  }}
                />
              ))}
            </div>
            {hasNextPage && currentPage * pageSize < totalCount && (
              <div className="flex justify-center mt-4">
                <Button onClick={loadMore} disabled={isLoading}>
                  {isLoading ? "로딩 중..." : "더 보기"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
