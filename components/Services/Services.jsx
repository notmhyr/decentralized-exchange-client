import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

//internal imports
import style from "./Services.module.scss";

const ServiceCard = ({ icon, color, title, subtitle }) => (
  <div className={style.serviceCard}>
    <div className={style.serviceCard_icon} style={{ backgroundColor: color }}>
      {icon}
    </div>

    <div className={style.serviceCard_info}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  </div>
);

const Services = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.services}>
        <div className={style.services_title}>
          <h1>
            Services that we <br /> continue to improve
          </h1>
        </div>

        <div className={style.services_items}>
          <ServiceCard
            color="#2952e3"
            icon={<BsShieldFillCheck fontSize={21} />}
            title="Security Guaranteed"
            subtitle="Security is guaranteed, We always maintain privacy and maintain quality of our products"
          />
          <ServiceCard
            color="#8945f8"
            icon={<BiSearchAlt fontSize={21} />}
            title="Best exchange rates"
            subtitle="Security is guaranteed, We always maintain privacy and maintain quality of our products"
          />
          <ServiceCard
            color="#f84550"
            icon={<RiHeart2Fill fontSize={21} />}
            title="Fastest transactions"
            subtitle="Security is guaranteed, We always maintain privacy and maintain quality of our products"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
