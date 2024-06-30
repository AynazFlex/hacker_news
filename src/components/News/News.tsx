import { ChangeEvent, FC, useState } from "react";
import style from "./News.module.css";
import useFetch from "../../hooks/useFetch/useFetch";
import NewsItems from "./NewsItems";

const News: FC = () => {
  const [type, setType] = useState("newstories");
  const types = ["newstories", "topstories", "beststories"];
  const { data, isLoading, error } = useFetch<number, string>({
    url: `https://hacker-news.firebaseio.com/v0/${type}.json?print=pretty`,
    deps: [type],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  return (
    <div className={style.news}>
      <div className={style.radio_items}>
        {types.map((item) => (
          <label className={style.label} key={item}>
            <input
              type="radio"
              value={item}
              checked={type === item}
              onChange={handleChange}
            />
            {item}
          </label>
        ))}
      </div>
      {isLoading && <div>loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading &&
        (data ? <NewsItems ides={data} /> : <div>Нет новостей</div>)}
    </div>
  );
};

export default News;
