import React from "react";
import Header from "../../components/Header";
import "./index.scss";

export default function Admin(props: any) {

  return (
    <div className="container">
      <div className="main">
        <Header />
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
}
