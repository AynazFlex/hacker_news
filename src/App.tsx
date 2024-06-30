import { FC } from "react";
import News from "./components/News/News";
import style from "./App.module.css";

const App: FC = () => {
  return (
    <div className={style.app}>
      <h1 className={style.title}>Новости</h1>
      <News />
    </div>
  );
};

export default App;
