import { FC, useEffect, useState } from 'react';
import './HomePage.css';
import { productData } from 'mocks/response';
import Card from '../../components/Card/Card';
import SearchSection from './SearchSection/SearchSection';
import useDebounce from 'hooks/useDebounce';
import Modal from 'components/Modal/Modal';
import CardContent from './CardContent/CardContent';

const HomePage: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredProductData, setFilteredProductData] = useState(
    productData.products
  );
  const [selectedProduct, setSelectedProduct] = useState({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const debouncedValue = useDebounce(inputValue, 1000);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const filteredData = productData.products.filter((product) =>
      product.title.toLowerCase().includes(debouncedValue.toLowerCase())
    );
    setFilteredProductData(filteredData);
  }, [debouncedValue]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onCloseModalHandler = () => {
    setModalVisible(false);
  };

  const onOpenModalHandler = () => {
    setModalVisible(true);
  };

  const onCardClickHandler = (id: number) => {
    const _filterProduct = productData.products.find(
      (product) => product.id === id
    );
    if (_filterProduct) {
      setSelectedProduct(_filterProduct);
    }
  };

  const loadProducts = (pageNumber: number) => {
    setIsLoading(true);
    setTimeout(() => {
      const startIndex = (pageNumber - 1) * 8;
      const endIndex = startIndex + 8;
      const newProducts = productData.products.slice(startIndex, endIndex);

      if (pageNumber === 1) {
        setFilteredProductData(newProducts);
      } else {
        setFilteredProductData((prevProducts) => [
          ...prevProducts,
          ...newProducts,
        ]);
      }

      setPage(pageNumber + 1);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadProducts(page);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 4 &&
      !isLoading
    ) {
      loadProducts(page);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, isLoading]);

  return (
    <>
      <Modal isOpen={modalVisible} onClose={onCloseModalHandler}>
        <CardContent />
      </Modal>
      <main className="home-container">
        <section className="search-section">
          <SearchSection onChangeHandler={onChangeHandler} value={inputValue} />
        </section>
        <section className="products-section" onClick={onOpenModalHandler}>
          {filteredProductData?.map((product, index) => (
            <div className="product-item" key={index}>
              <Card productObj={product} onClickHandler={onCardClickHandler} />
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default HomePage;
