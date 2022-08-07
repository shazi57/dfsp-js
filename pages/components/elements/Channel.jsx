import Image from 'next/image';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import checkIfAdmin from 'lit/checkIfAdmin';
import styles from './Channel.module.css';
import checkIfSubscriber from '../../../lit/checkIfSubscriber';

export default function Channel(props) {
  const router = useRouter();
  const {
    address, imageURI, name,
  } = props;

  const onNavigateClicked = async () => {
    await checkIfAdmin(address);
    router.push(`/channels/${address}`);
  };
  return (
    <div className={styles.entryContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={imageURI}
          width={40}
          height={40}
          alt="thumbnail"
        />
      </div>
      <Divider layout="vertical" style={{ margin: 0, padding: 0 }} />
      <div className={styles.titleContainer}>
        <h4>
          {name}
        </h4>
      </div>
      <Divider layout="vertical" style={{ margin: 0, padding: 0 }} />

      <div className={styles.addressContainer}>
        <h4 id={styles.address}>
          { address }
        </h4>
      </div>
      <Button
        onClick={onNavigateClicked}
        icon="pi pi-chevron-right"
        className="p-button-text"
        aria-label="Submit"
        style={{
          width: '2vw', height: '2vw', marginTop: '0.6vh', marginLeft: '1vw',
        }}
      />
    </div>
  );
}
