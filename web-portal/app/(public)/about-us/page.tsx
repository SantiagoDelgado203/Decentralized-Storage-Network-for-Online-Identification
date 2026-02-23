// app/about-us/page.tsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="text-lg leading-7 space-y-6">
        <p>
          Welcome to the Decentralized Identification Storage Network Project! We are a team of passionate
          individuals dedicated to provide a secure, scalable, and decentralized
          network for individuals and organizations to safely store verification information.
        </p>

        <p>
          Our mission is to provide a reliable platform where users can store their data
          without fear of data breaches or privacy invasions. We believe that data
          ownership should be in the hands of the people, and our platform allows users to have total control 
          over how their digital assets should be handled.
        </p>

        <h2 className="text-2xl font-semibold mt-10">Our Vision</h2>
        <p>
          We envision a world where decentralized technology revolutionizes how we store
          and share information. By decentralizing storage, we aim to build a more secure and 
          transparent ecosystem, where security is ensured and privacy is protected, 
          not by promises, but by robust system design.
        </p>

        <h2 className="text-2xl font-semibold mt-10">Our Values</h2>
        <ul className="list-disc pl-6">
          <li>Security: We prioritize the security of our users' data.</li>
          <li>Transparency: We are committed to an open-source, transparent approach.</li>
          <li>Community: We value the input and collaboration of our users and developers.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10">Meet the Team</h2>

        <ul className="list-disc pl-6">
        <li>
            <strong>Santiago Delgado</strong> - Team Leader
        </li>
        <li>
            <strong>Kanish Dangol</strong> - Member
        </li>
        <li>
            <strong>Syed Shah</strong> - Member
        </li>
        <li>
            <strong>Shiqiang Mo</strong> - Member
        </li>
        <li>
            <strong>Bao Nguyen</strong> - Member
        </li>
        </ul>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Contact Us</h3>
          <p>If you have any questions or feedback, feel free to reach out to us at:</p>
          <p className="text-blue-600">contact@decentralizedstorage.com</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;