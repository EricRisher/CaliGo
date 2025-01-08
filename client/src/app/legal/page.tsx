"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Usage: App router

function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="m-4 text-center">LEGAL</h1>
      <h3>Last Updated: 1/8/2025</h3>
      <p>
        This Privacy Policy for <strong>CaliGo</strong> ("we," "us," or "our")
        describes how we collect, use, and protect your personal information
        when you use our services ("Services"), including but not limited to:
      </p>
      <p>
        If you have questions or concerns about this policy, please contact us
        at <a href="mailto:caligo.site@gmail.com">caligo.site@gmail.com</a>
      </p>

      <p>
        By using our Services, you agree to this Privacy Policy. If you do not
        agree, please discontinue using our Services.
      </p>

      <h2>Summary of Key Points</h2>
      <ul className="list-disc list-inside">
        <li className="mb-4">
          <strong>What Personal Information Do We Collect?</strong> We collect
          information you provide (e.g., email, username, password) and data
          collected automatically (e.g., IP address, browser type).{" "}
          <a href="#what-information-do-we-collect"></a>
        </li>
        <li className="mb-4">
          <strong>Do We Process Sensitive Information?</strong> We do not
          process sensitive personal information (e.g., race, sexual
          orientation, or religious beliefs).
        </li>
        <li className="mb-4">
          <strong>Do We Collect Information From Third Parties?</strong> No, we
          do not collect information from third parties.
        </li>
        <li className="mb-4">
          <strong>How Do We Process Your Information?</strong> We use your
          information to provide and improve our Services, communicate with you,
          ensure security, and comply with legal obligations.{" "}
          <a href="#how-do-we-process-your-information"></a>
        </li>
        <li className="mb-4">
          <strong>Do We Share Your Information?</strong> We may share your data
          with service providers, during business transactions, or for legal
          compliance.{" "}
          <a href="#when-and-with-whom-do-we-share-your-personal-information"></a>
        </li>
        <li className="mb-4">
          <strong>How Do We Keep Your Information Safe?</strong> We implement
          organizational and technical safeguards, but no system is 100% secure.{" "}
          <a href="#how-do-we-keep-your-information-safe"></a>
        </li>
        <li className="mb-4">
          <strong>What Are Your Rights?</strong> Depending on your location, you
          may have rights to access, correct, delete, or restrict your data.{" "}
          <a href="#what-are-your-privacy-rights"></a>
        </li>
      </ul>

      <h2>Table of Contents</h2>
      <ol className="list-decimal list-inside mb-6">
        <li>
          <a href="#what-information-do-we-collect">
            What Information Do We Collect?
          </a>
        </li>
        <li>
          <a href="#how-do-we-process-your-information">
            How Do We Process Your Information?
          </a>
        </li>
        <li>
          <a href="#what-legal-bases-do-we-rely-on">
            What Legal Bases Do We Rely On?
          </a>
        </li>
        <li>
          <a href="#when-and-with-whom-do-we-share-your-personal-information">
            When and With Whom Do We Share Your Personal Information?
          </a>
        </li>
        <li>
          <a href="#what-is-our-stance-on-third-party-websites">
            What Is Our Stance on Third-Party Websites?
          </a>
        </li>
        <li>
          <a href="#do-we-use-cookies">Do We Use Cookies?</a>
        </li>
        <li>
          <a href="#how-long-do-we-keep-your-information">
            How Long Do We Keep Your Information?
          </a>
        </li>
        <li>
          <a href="#how-do-we-keep-your-information-safe">
            How Do We Keep Your Information Safe?
          </a>
        </li>
        <li>
          <a href="#do-we-collect-information-from-minors">
            Do We Collect Information From Minors?
          </a>
        </li>
        <li>
          <a href="#what-are-your-privacy-rights">
            What Are Your Privacy Rights?
          </a>
        </li>
        <li>
          <a href="#do-not-track-features">Do-Not-Track Features</a>
        </li>
        <li>
          <a href="#do-united-states-residents-have-specific-privacy-rights">
            US Residents’ Rights
          </a>
        </li>
        <li>
          <a href="#do-we-make-updates-to-this-policy">Policy Updates</a>
        </li>
        <li>
          <a href="#how-can-you-contact-us-about-this-policy">Contact Us</a>
        </li>
      </ol>

      <h2 id="what-information-do-we-collect">
        1. What Information Do We Collect?
      </h2>
      <h3>Personal Information You Provide</h3>
      <p>
        We collect personal information that you voluntarily provide when you:
      </p>
      <ul className="list-disc list-inside">
        <li>Register for an account.</li>
        <li>Contact us or express interest in our Services.</li>
        <li>Participate in surveys, promotions, or events.</li>
      </ul>

      <p>
        <strong>Examples of Collected Data:</strong>
      </p>
      <ul className="list-disc list-inside">
        <li>Email addresses.</li>
        <li>Usernames.</li>
        <li>Passwords.</li>
      </ul>

      <h3 className="mt-8">Automatically Collected Information</h3>
      <p>We automatically collect certain technical information, including:</p>
      <ul className="list-disc list-inside">
        <li>IP addresses.</li>
        <li>Browser types and settings.</li>
        <li>Device information (e.g., model, operating system).</li>
        <li>Usage data (e.g., pages visited, time spent on pages).</li>
      </ul>

      <span className="mt-4">
        <strong>Cookies and Similar Technologies:</strong> We use cookies to
        enhance user experience, analyze traffic, and personalize content.{" "}
        <a href="#do-we-use-cookies"></a>
      </span>

      <h2 id="how-do-we-process-your-information" className="mt-8">
        2. How Do We Process Your Information?
      </h2>
      <p>We process personal information for the following purposes:</p>
      <ul>
        <li>
          <strong>Account Management:</strong> Facilitate account creation and
          maintenance.
        </li>
        <li>
          <strong>Feedback Requests:</strong> Contact you for feedback on our
          Services.
        </li>
        <li>
          <strong>Service Improvements:</strong> Analyze usage trends and
          enhance features.
        </li>
        <li>
          <strong>Security and Fraud Prevention:</strong> Protect user accounts
          and our platform.
        </li>
        <li>
          <strong>Legal Compliance:</strong> Fulfill obligations under
          applicable laws.
        </li>
      </ul>

      <h2 id="what-legal-bases-do-we-rely-on" className="mt-8">
        3. What Legal Bases Do We Rely On?
      </h2>
      <p>We process your information based on:</p>
      <ul>
        <li>
          <strong>Consent:</strong> When you give explicit permission (e.g., to
          send marketing emails).
        </li>
        <li>
          <strong>Contractual Obligations:</strong> To provide Services you’ve
          requested.
        </li>
        <li>
          <strong>Legitimate Interests:</strong> For purposes like improving
          user experience.
        </li>
        <li>
          <strong>Legal Compliance:</strong> To meet legal and regulatory
          requirements.
        </li>
      </ul>

      <h2
        id="when-and-with-whom-do-we-share-your-personal-information"
        className="mt-8"
      >
        4. When and With Whom Do We Share Your Personal Information?
      </h2>
      <p>We may share your information in the following cases:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> For hosting, analytics, or email
          delivery.
        </li>
        <li>
          <strong>Business Transfers:</strong> During mergers or acquisitions.
        </li>
        <li>
          <strong>Legal Obligations:</strong> To comply with court orders or
          subpoenas.
        </li>
      </ul>

      <h2 id="what-is-our-stance-on-third-party-websites" className="mt-8">
        5. What Is Our Stance on Third-Party Websites?
      </h2>
      <p>
        We are not responsible for the privacy practices of third-party websites
        linked to our Services. Review their privacy policies before sharing
        personal information.
      </p>

      <h2 id="do-we-use-cookies" className="mt-8">
        6. Do We Use Cookies?
      </h2>
      <p>
        Yes, we use cookies to collect data about your browsing behavior. You
        can manage cookie preferences through your browser settings. For more
        details, read our Cookie Policy.
      </p>

      <h2 id="how-long-do-we-keep-your-information" className="mt-8">
        7. How Long Do We Keep Your Information?
      </h2>
      <p>
        We retain your information only as long as necessary for legitimate
        purposes or legal obligations. When no longer needed, data will be
        deleted or anonymized.
      </p>

      <h2 id="how-do-we-keep-your-information-safe" className="mt-8">
        8. How Do We Keep Your Information Safe?
      </h2>
      <p>
        We use encryption, firewalls, and regular monitoring to protect your
        data. However, no method of transmission over the internet is 100%
        secure.
      </p>

      <h2 id="do-we-collect-information-from-minors" className="mt-8">
        9. Do We Collect Information From Minors?
      </h2>
      <p>
        No, we do not knowingly collect data from individuals under 18. If you
        believe we have inadvertently collected such data, contact us to have it
        deleted.
      </p>

      <h2 id="what-are-your-privacy-rights" className="mt-8">
        10. What Are Your Privacy Rights?
      </h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li>Access your personal data.</li>
        <li>Correct inaccuracies.</li>
        <li>Delete your data.</li>
        <li>Restrict data processing.</li>
      </ul>
      <p>
        To exercise your rights, contact us at{" "}
        <a href="mailto:caligo.site@gmail.com">caligo.site@gmail.com</a>.
      </p>

      <h2 id="do-not-track-features">11. Do-Not-Track Features</h2>
      <p>
        We do not currently respond to Do-Not-Track (DNT) signals due to a lack
        of standardization. If standards evolve, we will update this policy.
      </p>

      <h2 id="do-united-states-residents-have-specific-privacy-rights">
        12. US Residents’ Rights
      </h2>
      <p>
        Residents of certain states (e.g., California, Virginia) may have
        additional rights, including:
      </p>
      <ul>
        <li>Opting out of targeted advertising.</li>
        <li>Accessing or deleting personal information.</li>
        <li>Receiving a portable copy of your data.</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:caligo.site@gmail.com">caligo.site@gmail.com</a>.
      </p>

      <h2 id="do-we-make-updates-to-this-policy">
        13. Do We Make Updates to This Policy?
      </h2>
      <p>
        Yes, we may update this policy to remain compliant with laws. Updates
        will be noted by the "Last Updated" date. Significant changes may be
        communicated via email or on our website.
      </p>

      <h2 id="how-can-you-contact-us-about-this-policy">
        14. How Can You Contact Us About This Policy?
      </h2>
      <p>For questions or concerns, contact us at:</p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:caligo.site@gmail.com">caligo.site@gmail.com</a>
        </li>
      </ul>
      <h2 className="m-10 text-center">
        WE ARE NOT RESPONSIBLE FOR YOUR ACTIONS, PROCEED AT YOUR OWN RISKS
      </h2>
      <div className="relative w-full p-4 flex justify-between items-center z-10">
        <button
          onClick={() => router.back()}
          className="underline flex flex-row items-center space-x-2 text-lg"
        >
          <Image
            src="/icons/back.png"
            alt="Back"
            width={32}
            height={32}
            className="ml-3 mr-1 icon-size"
          />
          I understand, take me back
        </button>
      </div>
    </div>
  );
}

export default Page;
