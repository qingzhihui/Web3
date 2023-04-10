import React, { useState } from "react";
import "./index.scss";
import { ExclamationOutlined, ReloadOutlined } from "@ant-design/icons";

const Promes = (props: any) => {
  return (
    <div className="pserExbuse">
      <div className="pserzhes"></div>
      <div className="pserTise">
        <div className="pserExchange_nro">
          <div className="nriopsr">
            <div className="logding">
              {props.oreTime === 1 ? (
                <div className="xgirm">
                  <ReloadOutlined
                    spin
                    style={{ fontSize: "40px", color: "rgb(75, 154, 214)" }}
                  />
                </div>
              ) : props.oreTime === 2 ? (
                <ExclamationOutlined className="Luiisnr" />
              ) : (
                <ExclamationOutlined className="Luiisnr" />
              )}
            </div>
            <div className="Ptimeb">{props.gontime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promes;
