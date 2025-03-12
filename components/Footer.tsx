import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="max-w-7xl mx-auto border-t px-4">
      <div className="flex justify-between py-8">
        <p className="text-primary tracking-tight">
          Developed by{" "}
          <Link href={"https://nakul.space"} className="font-bold">
            Nakul
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Footer;
