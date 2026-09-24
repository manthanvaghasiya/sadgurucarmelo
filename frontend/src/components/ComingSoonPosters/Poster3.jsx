import React from 'react';
import { PosterDesign3 } from '../ComingSoonCarousel';

export default function Poster3({ car, onOpenModal = () => {} }) {
  return <PosterDesign3 car={car} onOpenModal={onOpenModal} />;
}
