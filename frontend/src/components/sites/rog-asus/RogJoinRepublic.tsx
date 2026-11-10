"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { RogApi } from "@/lib/api-client";
import "./RogJoinRepublic.css";

const DEFAULT_JR = {
  title: "THE ART OF THE ROG UNIVERSE",
  desc: "Technology never sleeps, nor should the action. For those keen on winning power, the Republic of Gamers awaits. Driven by relentless innovation, ROG is committed to producing out-of-this-world experiences for gamers and enthusiasts everywhere.",
  url: "/vn/rog-saga-group",
  img: "/sites/rog-asus/img/misc/join-the-republic.webp",
  imgAlt: "Join the Republic",
};

export default function RogJoinRepublic() {
  const [data, setData] = useState(DEFAULT_JR);

  useEffect(() => {
    RogApi.getSiteConfig().then((cfg) => {
      if (cfg?.joinRepublic?.title) {
        setData({
          title: cfg.joinRepublic.title,
          desc: cfg.joinRepublic.description || DEFAULT_JR.desc,
          url: cfg.joinRepublic.url || DEFAULT_JR.url,
          img: cfg.joinRepublic.image || DEFAULT_JR.img,
          imgAlt: cfg.joinRepublic.imageAlt || DEFAULT_JR.imgAlt,
        });
      }
    });
  }, []);

  return (
    <a
      className="rog-jr rog-jr-link"
      href={data.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${data.title} — ROG Saga`}
    >
      <div className="rog-jr-text">
        <h2 className="rog-jr-title">{data.title}</h2>
        <p className="rog-jr-desc">{data.desc}</p>
      </div>
      <div className="rog-jr-art">
        <img src={data.img} alt={data.imgAlt} />
      </div>
    </a>
  );
}
