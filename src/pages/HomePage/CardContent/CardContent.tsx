import { FC } from 'react';
import './CardContent.css';

interface CardContentProps {}

const CardContent: FC<CardContentProps> = () => {
  return (
    <div className="card-content-container">
      <div className="content__inner">x</div>
      <div className="content__inner">y</div>
    </div>
  );
};

export default CardContent;
