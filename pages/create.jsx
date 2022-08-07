import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { ethers } from 'ethers';
import { Toast } from 'primereact/toast';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { NFTStorage } from 'nft.storage';
import abi from './artifacts/ZoraNFTCreatorV1.json';
import useProvider from '../hooks/useProvider';
import useSigner from '../hooks/useSigner';
import signAndReturnJwt from '../lit/signAndReturnJwt';

export default function Create() {
  const router = useRouter();
  const provider = useProvider();
  const { signer, signerAddr } = useSigner(provider);
  const [selectedImage, selectImage] = useState(false);
  const fileUploadRef = useRef(null);
  const toast = useRef(null);
  const [formInput, setFormInput] = useState({
    name: '',
    symbol: '',
    numFans: 0,
    royaltyBPS: 0,
    fundsRecipient: '',
    defaultAdmin: '',
    // sales config
    publicSalePrice: 0,
    maxSalePurchasePerAddress: 1,
    publicSaleStart: '',
    publicSaleEnd: '',
    preSaleStart: '',
    preSaleEnd: '',
    presaleMerkleRoot: '',
    // salseconfig end
    description: '',
    animationURI: '',
    imageURI: '',
  });

  const onSelect = async (e) => {
    selectImage(e.files[0]);
  };

  const uploadOptions = { className: 'upload-elem' };
  const cancelOptions = { className: 'cancel-elem' };

  const handleInputChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const nftstorage = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY });
    const creatorContract = new ethers.Contract(process.env.NEXT_PUBLIC_ZORA_NFT_DROP_CONTRACT_ADDR, abi, signer);
    const proxyContract = await creatorContract.attach(process.env.NEXT_PUBLIC_ZORA_NFT_DROP_PROXY_ADDR);
    try {
      const cid = await nftstorage.storeBlob(selectedImage);
      const imageURI = `https://ipfs.io/ipfs/${cid}`;
      const publicSaleStart = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
      const publicSaleEnd = ethers.BigNumber.from(2).pow(64).sub(10000);
      const preSaleStart = ethers.BigNumber.from(0);
      const preSaleEnd = ethers.BigNumber.from(0);
      const publicSalePrice = ethers.utils.parseEther(formInput.publicSalePrice.toString(), 'wei');
      const royaltyBPS = ethers.BigNumber.from(formInput.royaltyBPS).mul(100);
      const presaleMerkleRoot = ethers.utils.hexZeroPad('0x0', 32);
      const defaultAdmin = signerAddr;

      const params = [
        formInput.name,
        formInput.symbol,
        formInput.numFans,
        royaltyBPS,
        formInput.fundsRecipient,
        defaultAdmin,
        [
          publicSalePrice,
          formInput.maxSalePurchasePerAddress,
          publicSaleStart,
          publicSaleEnd,
          preSaleStart,
          preSaleEnd,
          presaleMerkleRoot,
        ],
        formInput.description,
        formInput.animationURI,
        imageURI,
      ];

      const tx = await proxyContract.createEdition(...params);
      const txReceipt = await tx.wait();
      const event = txReceipt.events.find(({ event }) => (event === 'CreatedDrop'));
      const channelAddress = event.args[1];
      await signAndReturnJwt(channelAddress);
      router.push(`/channels/${channelAddress}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="form-wrapper">
      <Toast ref={toast} />
      <div className="i-entry" id="i-name">
        <h5>Channel Name</h5>
        <InputText
          name="name"
          className="i-entry-input"
          value={formInput.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="i-entry" id="i-symbol">
        <h5>Channel Symbol (max three characters) </h5>
        <InputText
          name="symbol"
          className="i-entry-input"
          value={formInput.symbol}
          onChange={handleInputChange}
        />
      </div>
      <div className="i-entry" id="i-numFans">
        <h5>Max number of fans</h5>
        <InputNumber
          name="numFans"
          className="i-entry-input"
          value={formInput.numFans}
          onValueChange={handleInputChange}
        />
      </div>
      <div className="i-entry" id="i-publicSalePrice">
        <h5>NFT Pass Price</h5>
        <InputNumber
          name="publicSalePrice"
          className="i-entry-input"
          value={formInput.publicSalePrice}
          mode="decimal"
          minFractionDigits={2}
          onValueChange={handleInputChange}
          suffix=" ETH"
        />
      </div>
      <div className="i-entry" id="i-royaltyBPS">
        <h5>Royalty (%) </h5>
        <InputNumber
          name="royaltyBPS"
          className="i-entry-input"
          value={formInput.royaltyBPS}
          onValueChange={handleInputChange}
          suffix=" %"
        />
      </div>
      <div className="i-entry" id="i-description">
        <h5>Description</h5>
        <InputTextarea
          name="description"
          className="i-entry-input"
          id="i-entry-textarea"
          value={formInput.description}
          onChange={handleInputChange}
          style={{ height: '20vh' }}
        />
      </div>
      <div className="i-entry" id="i-fundsRecipient">
        <h5>Payout Address</h5>
        <InputText
          name="fundsRecipient"
          className="i-entry-input"
          value={formInput.fundsRecipient}
          onChange={handleInputChange}
        />
      </div>
      <FileUpload
        ref={fileUploadRef}
        name="demo"
        accept="image/*"
        maxFileSize={1000000}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        customUpload
        onSelect={onSelect}
        // uploadHandler={handleUpload}
        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
      />
      <div id="button-wrapper">
        <Button onClick={handleOnSubmit} className="p-button-primary" id="create-button" label="Create Channel" />
      </div>
      <style jsx>
        {`
          .upload-elem {
            display: hidden;
          }
          #button-wrapper {
            margin-top: 3vh;
            width: 100%;
            text-align: center;
          }
          #i-fundsRecipient {
            margin-bottom: 3vh;
          }
          h5 {
            font-size: 1.7vh;
            margin-left: 0.2vw;
            color: var(--text-color-primary);
          }
          h3 {
            margin-left: 13vw;
          }
          #form-wrapper {
            display: flex;
            flex-direction: column;
            border-radius: var(--border-radius);
            width: 40vw;
            margin-top : 5vh;
            margin-bottom: 5vh;
            margin-left: auto;
            margin-right: auto;
            background-color: var(--surface-card);
            padding-top: 3vh;
            padding-left: 3vw;
            padding-right: 3vw;
            padding-bottom: 3vh;
          }
        `}
      </style>
    </div>
  );
}
