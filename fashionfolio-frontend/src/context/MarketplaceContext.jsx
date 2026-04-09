import React, { createContext, useState } from "react";

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [listings, setListings] = useState([
    {
      id: "1",
      title: "Jean Slim Vert",
      description:
        "Je vends ce jean slim vert taille M. Il est en très bon état, peu porté. Matière agréable au toucher !", // 👈 AJOUTÉ
      price: 35,
      original_price: 60,
      condition: "très bon état",
      size: "M",
      images: [
        "https://i.pinimg.com/564x/4a/26/d0/4a26d0b6e15967b55f1a4e1d4b68078c.jpg",
      ],
      item: { brand: "Ami", category: "bas" },
    },
    {
      id: "2",
      title: "Veste en Jean Vintage",
      description:
        "Superbe veste en jean Levi's des années 90. Parfaite pour la mi-saison, style oversize.", // 👈 AJOUTÉ
      price: 45,
      condition: "usage visible",
      size: "L",
      images: [
        "https://i.pinimg.com/736x/87/4a/62/874a6217df70b94df0721da298dbcbbf.jpg",
      ],
      item: { brand: "Levi's", category: "haut" },
    },
  ]);

  const addListing = (newListing) => {
    setListings([newListing, ...listings]);
  };

  return (
    <MarketplaceContext.Provider value={{ listings, addListing }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
