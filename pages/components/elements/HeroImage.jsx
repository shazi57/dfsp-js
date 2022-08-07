import Image from "next/image";

export default function HeroImage(props) {
  const { imageURL } = props;
  return (
    <div id="hero-container">
      <Image
        alt="hero"
        id="hero-image"
        src={imageURL}
        layout="fill"
        objectFit="contain"
      />
      <style jsx>
        {`
          #image-sizer {
          }
          #hero-image {
            object-fit: contain;
          }
          #hero-container {
            position: relative;
            margin-top: 10vh;
            width : 100%;
            height : 70vh;
            background-color: var(--surface-card);
          }
        `}
      </style>
    </div>
  );
}
