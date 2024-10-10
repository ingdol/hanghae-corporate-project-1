import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ApiErrorBoundary } from "@/pages/common/components/ApiErrorBoundary";
import { debounce } from "@/utils/common";
import React from "react";
import { CategoryRadioGroup } from "./CategoryRadioGroup";
import { PriceRange } from "./PriceRange";
import { SearchBar } from "./SearchBar";
import useFilterStore from "@/store/filter/useFilterStore";

const ProductFilterBox = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  const { categoryId, setMinPrice, setMaxPrice, setTitle, setCategoryId } =
    useFilterStore();

  const handleChangeInput = debounce((e) => {
    setTitle(e.target.value);
  }, 300);

  const handlePriceChange = (actionCreator) =>
    debounce((e) => {
      const value = e.target.value;
      if (value === "") {
        actionCreator(-1);
      } else {
        const numericValue = Math.max(0, parseInt(value, 10));
        if (!isNaN(numericValue)) {
          actionCreator(numericValue);
        }
      }
    }, 300);

  const handleMinPrice = handlePriceChange(setMinPrice);
  const handleMaxPrice = handlePriceChange(setMaxPrice);

  const handleChangeCategory = (value) => {
    if (value !== undefined) {
      setCategoryId(value);
    } else {
      console.error("카테고리가 설정되지 않았습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="h-24 w-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={categoryId}
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange
          onChangeMinPrice={handleMinPrice}
          onChangeMaxPrice={handleMaxPrice}
        />
      </ProductFilterBox>
    </div>
  );
};
