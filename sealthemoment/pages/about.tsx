import React from "react";

const About: React.FC<{}> = () => {
  return (
    <div className="about">
      <h1 className="about--heading">Welcome to Seal_The_Moment 🤟</h1>

      <h2 className="about--subheading">
        Seal The Momemt is a decentralized web application for converting your
        photographs to Non Fungible Tokens, tokens that you can then use for
        creating Postcards for your friends! In this page we provide our guests
        with an easy step-by-step guide for creating a wallet with Metamask,
        connecting their ethereum address to their STM account during their
        registration and finally using our services.
      </h2>

      <h3 className="about--sectionHeading">Selecting a Wallet</h3>
      <p className="about--text">
        Although there are many wallets, each having its own strengths and
        weaknesses, our application has been developed and tested thoroughly
        while using Metamask. By installing Metamask, you also inject your
        browser with the Ethereum API which is required by our application to
        connect to the public blockchain that we use.
        <span className="about--attention">Note!</span> Other wallets that use
        the Ethereum API, might also work. However, we strongly recommend using
        Metamask so that you avoid any potential issues being raised.
      </p>

      <h3 className="about--sectionHeading">Installing Metamask</h3>

      <p className="about--text">
        You can easily download Metamask from its official site. Head over{" "}
        <a className="about--link" href="https://metamask.io/">https://metamask.io</a>, click the
        Download button and add Metamask as an extension in your browser or
        install the application in your phone.
      </p>

      <h3 className="about--sectionHeading">Creating a Wallet</h3>

      <h3 className="about--sectionsubHeading">Importing an existing Wallet</h3>

      <p>
        If you have used Metamask before, you can easily use it again by
        submitting your wallet's Secret Recovery Phrase - SRP and creating a new
        password. That's it! Your wallet is ready, you can import any accounts
        that you were using in the past and start creating these fantastic
        Postcards for your friends!
      </p>

      <h3 className="about--sectionsubHeading">Creating a new Wallet</h3>

      <p className="about--text">
        If you are a new user, it is time to create your first wallet in
        Metamask!
        <ul className="about--list">
          <li className="about--item">
            First of all, you need to create a password in order to make your
            account more secure.
          </li>
          <li className="about--item">
            Then, Metamask will create a <b>SRP</b> for you. SRP is the only
            means of recovering your wallet in case you accidentally lose it at
            some point in the future.
          </li>
          <li className="about--item">
            Finally, Metamask will ask you to confirm your <b>SRP</b>. Your
            wallet as well as your ethereum account is ready for you!
          </li>
        </ul>
      </p>

      <h3 className="about--sectionHeading">Metamask Wallet Management</h3>

      <p className="about--text">
        Your wallet has been successfully created. Your account is now ready to
        be used for any transaction across the decentralized network!
        <br />
        <span className="about--attention">Important note! </span> In case you
        have not registered yet, you must paste your account address in the
        respected field in the registration form. Don't worry: you can easily
        change in later if you want.
        <br />
        Furthermore, you can import an account by providing Metamask with the
        account's private key or create a new account belonging to the same
        wallet!
      </p>

      <p className="about--footer">
        That's all folks! Hopefully, you have learnt how to get started with
        Metamask and how to connect your account with our application. Should
        you have any questions concerning Metamask, you can always read its
        official <a className="about--link" href="https://docs.metamask.io/guide/">guide</a>!
      </p>
    </div>
  );
};

export default About;
