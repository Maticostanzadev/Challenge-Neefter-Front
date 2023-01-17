/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios"
import Swal from "sweetalert2";
import { uploadFile } from "../../firebase/config";
import style from "./mint.module.css";
import { BsImageFill, BsFillTrashFill, BsExclamationOctagon } from "react-icons/all";
import Loader from "../Loader/Loader"

export default function Mint() {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [errors, setErrors] = useState({})
  const [loader, setLoader] = useState(false)
  const [nft, setNft] = useState({
    name: "",
    description: "",
    image: "",
    attributes: [],
    email: "example_youremail@gmail.com"
  })

  // //------------------------ Validation ------------------------//

  function validate(nft) {
    let error = {}
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (nft.name.length > 30) {
      error.name = "Name must be less than 50 characters."
    }

    if (nft.description.length > 300) {
      error.description = "Description must be less than 300 characters."
    }

    if (!nft.image.length) {
      error.image = "Image is required."
    }

    if (!nft.email.match(regexEmail)) {
      error.email = "Email is not valid."
    }

    setErrors(error)
  }

  useEffect(() => {
    validate(nft)
  }, [nft])

  useEffect(() => {
    if (!nft.name.length && !nft.description.length && !nft.image.length && !nft.attributes.length) return;
    if (!Object.keys(errors).length) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [errors])
  // //---------------------- END Validation ----------------------//


  function onChange(e) {
    setNft({
      ...nft,
      [e.target.name]: e.target.value,
    })
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoader(true)
      let response = await axios.post(`/mint`, nft)
      console.log(response.data)
      if (!response.data.message) {
        let status = await axios.get(`/mint?id=${response.data.id}`)
        console.log(status.data)
      }
      setLoader(false)
      setNft({
        name: "",
        description: "",
        image: "",
        attributes: [],
        email: "example_youremail@gmail.com"
      })
      Swal.fire({
        icon: 'success',
        title: '¡Congratulations, you have created an NFT!',
        text: 'You can find it on the page: "https://staging.crossmint.com/user/collection" logging in with the email you have chosen!',
        allowOutsideClick: false
      })
    } catch (error) {
      setLoader(false)
      Swal.fire({
        icon: 'error',
        title: 'An error has occurred',
        text: '¡Try again!',
        allowOutsideClick: false
      })
    }
  }

  async function handleChangeImage(e) {
    e.preventDefault()
    // console.log(e.target.files[0].name)
    const imageUrl = await uploadFile(e.target.files[0], e.target.files[0].name);
    console.log(imageUrl)
    setNft({ ...nft, image: imageUrl });
  }

  function handleDeleteImage(e) {
    e.preventDefault()
    setNft({ ...nft, image: "" });
  }

  async function addAttribute() {
    const { value: formValues } = await Swal.fire({
      title: 'Add new attribute',
      html:
        '<label>Type:</label><input id="swal-input1" class="swal2-input">' + '<br></br>' +
        '<label>Value:</label><input id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        let newAttribute = {}
        newAttribute.trait_type = document.getElementById('swal-input1').value
        newAttribute.value = document.getElementById('swal-input2').value
        // newAttribute[document.getElementById('swal-input1').value] = document.getElementById('swal-input2').value
        if (Object.keys(newAttribute)[0].length !== 0 && Object.values(newAttribute)[0].length !== 0) {
          setNft({
            ...nft,
            attributes: [...nft.attributes, newAttribute],
          })
          return "Attribute added successfully"
        }
        return { msgError: "You must complete both fields" }
      }
    })

    if (formValues && formValues.msgError) {
      Swal.fire(formValues.msgError)
    }
  }

  function handleDeleteAttribute(e, type, value) {
    e.preventDefault()
    let newAttribute = nft.attributes.filter(attr => attr.trait_type !== type && attr.value !== value)
    setNft({
      ...nft,
      attributes: newAttribute,
    })
  }

  return (
    <div className={style.mintContainer}>
      {
        loader ? <Loader /> :
          <form className={style.mintForm} onSubmit={onSubmit}>
            <h1 className={style.mintTitle}>Create New NFT</h1>
            <div className={style.fileContainer}>
              <h2 className={style.fileTitle}>Insert your NFT *</h2>
              <h4 className={style.fileTypes}>File types supported: JPG, GIF, PNG, MP4, SVT, MP3, WebM, WAV, GLTF, GLB, OGG</h4>
              <h4 className={style.fileTypes}>Max size: 100 MB</h4>
              <label className={style.fileCharge} onClick={() => document.querySelector(".inputFile").click()}>
                {nft.image.length ?
                  <div>
                    <img src={nft.image}></img>
                    <BsFillTrashFill className={style.trash} onClick={handleDeleteImage} />
                  </div>
                  :
                  <div>
                    <h2>Click here to upload your NFT</h2>
                    <BsImageFill className={style.fileIcon} />
                  </div>
                }
                <input hidden type="file" id="inputFile" className={style.fileInput} onChange={handleChangeImage} />
              </label>
            </div>
            <div className={style.mintFieldsContainer}>
              <label className={style.mintLabel}>Name *</label>
              <input className={style.mintInputText} type="text" name="name" placeholder="Item name" value={nft.name} onChange={onChange} />
              {errors.name ?
                <span className={style.errorText}>
                  <BsExclamationOctagon className={style.exclamationIcon} />
                  {errors.name}
                </span>
                : ""}
            </div>
            <div className={style.mintFieldsContainer}>
              <label className={style.mintLabel}>Description *</label>
              <textarea className={style.mintInputTextarea} name="description" placeholder="Provide a detailed description of your item" value={nft.description} onChange={onChange} />
              {errors.description ?
                <span className={style.errorText}>
                  <BsExclamationOctagon className={style.exclamationIcon} />
                  {errors.description}
                </span>
                : ""}
            </div>
            <div className={style.mintFieldsContainer}>
              <label className={style.mintLabel}>Email *</label>
              <span>
                A wallet will be created with this email, the NFT will be hosted here. You need to login with this email at the link: "https://staging.crossmint.com/user/collection"</span>
              <input className={style.mintInputText} type="text" name="email" placeholder="email" value={nft.email} onChange={onChange} />
              {errors.email ?
                <span className={style.errorText}>
                  <BsExclamationOctagon className={style.exclamationIcon} />
                  {errors.email}
                </span>
                : ""}
            </div>
            <div className={`${style.mintFieldsContainer} ${style.mintFieldsContainerExep}`}>
              <label className={style.mintLabel}>Attributes</label>
              {
                nft.attributes.length ?
                  nft.attributes.map(attr => (
                    <div key={attr.value} className={style.attributeContainer}>
                      <label className={style.attributeLabel}>{`${attr.trait_type}:`}</label>
                      <div className={style.attributeValue}>
                        {attr.value}
                        <BsFillTrashFill className={style.trashAttribute} onClick={(e, type, value) => handleDeleteAttribute(e, attr.trait_type, attr.value)} />
                      </div>
                    </div>

                  ))
                  : <></>
              }
              <div className={style.mintAddAttribute} onClick={addAttribute} id="attributes">Add new attribute</div>
            </div>
            <span>* Required fields</span>
            <button className={buttonDisabled ? `${style.mintButtonDisabled} ${style.mintButton}` : style.mintButton} disabled={buttonDisabled}>Mint NFT</button>
          </form >
      }
    </div >
  )
}

