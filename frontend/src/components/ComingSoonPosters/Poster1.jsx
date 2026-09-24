import React from 'react';
import { PosterDesign1 } from '../ComingSoonCarousel';

export default function Poster1({ car, onOpenModal = () => {} }) {
  return <PosterDesign1 car={car} onOpenModal={onOpenModal} />;
}
