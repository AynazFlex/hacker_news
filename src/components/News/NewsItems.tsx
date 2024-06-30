import { FC, useEffect, useRef, useState } from "react";
import style from "./News.module.css";

interface IProps {
  ides: number[];
}

interface INews {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

const NewsItems: FC<IProps> = ({ ides }) => {
  const [news, setNews] = useState<INews[]>([]);
  const index = useRef<number>(0);
  const stopFetch = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const getNews = () =>
    Promise.allSettled(
      ides
        .slice(index.current, index.current + 30)
        .map((id) =>
          fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
          ).then((response) => response.json())
        )
    ).then((results) =>
      results.reduce<INews[]>((acc, result) => {
        if (result.status == "fulfilled") {
          acc.push(result.value as INews);
        }

        return acc;
      }, [])
    );

  useEffect(() => {
    setIsLoading(true);
    getNews().then((items) => {
      setNews((prev) => [...prev, ...items]);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 5 <
          document.documentElement.offsetHeight ||
        stopFetch.current
      ) {
        return;
      }

      index.current += 30;
      console.log(index.current);
      stopFetch.current = true;
      setIsLoading(true);
      getNews().then((items) => {
        setNews((prev) => [...prev, ...items]);
        setIsLoading(false);
        stopFetch.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={style.news_items}>
      {news.map((item, index) => (
        <div className={style.news_item} key={item.id}>
          <h2 className={style.news_title}>
            <a className={style.news_link} target="_blank" href={item.url}>
              {index} {item.title}
            </a>
          </h2>
          <div className={style.news_info}>
            <span className={style.news_by}>{item.by}</span>
            <span className={style.news_score}>{item.score}</span>
          </div>
        </div>
      ))}
      {isLoading && <div>loading...</div>}
    </div>
  );
};

export default NewsItems;
