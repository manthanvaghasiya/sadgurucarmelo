import React from 'react';
import { PosterDesign2 } from '../ComingSoonCarousel';

export default function Poster2({ car, onOpenModal = () => {} }) {
  return <PosterDesign2 car={car} onOpenModal={onOpenModal} />;
}
