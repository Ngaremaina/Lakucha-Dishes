import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">About Us</h2>

      <h3 className="text-2xl font-semibold text-gray-800">Welcome to Lakucha Dishes!</h3>
      <p className="text-gray-700 leading-relaxed">
        At Lakucha Dishes, we are passionate about food and convenience. Our mission is to revolutionize the way you enjoy your favorite meals by offering a seamless and delightful food ordering experience right at your fingertips. Whether you're craving your go-to comfort food or want to explore new culinary delights, we're here to make it easy, quick, and satisfying.
      </p>

      <h3 className="text-2xl font-semibold text-gray-800">Our Story</h3>
      <p className="text-gray-700 leading-relaxed">
        Our journey began with a simple realization: modern life can be hectic, and finding time to prepare a homemade meal isn't always possible. We believe that everyone deserves access to delicious, high-quality food, delivered with speed and precision. That's why we founded Lakucha Dishes - to bridge the gap between your cravings and culinary satisfaction.
      </p>

      <h3 className="text-2xl font-semibold text-gray-800">What We Offer</h3>
      <ol className="list-decimal list-inside space-y-2 pl-4 text-gray-700">
        <li>
          <span className="font-medium">Extensive Menu Selection:</span> Browse our curated list of local restaurants and discover a diverse range of cuisines. From Italian to Japanese, from vegan to barbecue, we have something to satisfy every palate.
        </li>
        <li>
          <span className="font-medium">Effortless Ordering:</span> Our user-friendly platform allows you to place orders with ease. Customize your meal, choose your delivery or pickup preferences, and pay securely—all in just a few clicks.
        </li>
        <li>
          <span className="font-medium">Real-Time Tracking:</span> Stay in the loop with real-time order tracking. Know exactly when your food will be ready or when it's en route to your doorstep.
        </li>
        <li>
          <span className="font-medium">Exclusive Deals:</span> Enjoy exclusive discounts, promotions, and special offers from your favorite eateries. We believe in providing value for your appetite.
        </li>
        <li>
          <span className="font-medium">Customer Support:</span> Our dedicated customer support team is available to assist you with any questions or concerns. Your satisfaction is our priority.
        </li>
      </ol>

      <h3 className="text-2xl font-semibold text-gray-800">Our Team</h3>
      <p className="text-gray-700 leading-relaxed">
        We're a team of food enthusiasts, tech innovators, and customer service experts who are committed to enhancing your dining experience. We work closely with local restaurants to ensure that you receive top-notch service and food quality every time you order through Lakucha Dishes.
      </p>

      <h3 className="text-2xl font-semibold text-gray-800">Contact Us</h3>
      <p className="text-gray-700 leading-relaxed">
        Your feedback matters to us! If you have any comments, suggestions, or inquiries, please reach out to us at{" "}
        <a href="mailto:lakuchadishes@gmail.com" className="text-blue-600 underline">
          lakuchadishes@gmail.com
        </a>. We value your input and are always striving to improve your food ordering experience.
      </p>

      <p className="text-gray-700 leading-relaxed">
        Thank you for choosing Lakucha Dishes as your trusted partner in satisfying your food cravings. We look forward to serving you and making your dining experiences more enjoyable, convenient, and delightful. Bon appétit!
      </p>
    </div>
  );
};

export default About;
