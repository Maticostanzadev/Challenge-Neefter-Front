import style from "./loader.module.css";

export default function Loader() {
  return (
    <div className={style.loaderContainer}>
      <div className={style.loader}></div>
      <p className={style.loaderText}>Minting NFT</p>
    </div>
  )
}