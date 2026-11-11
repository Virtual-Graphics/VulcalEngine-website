import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const games = [
  {
    title: '贪吃蛇',
    image: 'img/showcase/snake.png',
    width: 1297,
    height: 971,
    description: '熟悉的规则，简单的乐趣。',
  },
  {
    title: '最后三分钟',
    image: 'img/showcase/arena.png',
    width: 1307,
    height: 972,
    description: '移动、射击、冲刺，在竞技场中生存三分钟。',
  },
];

function GamePreview({title, image, width, height, description}) {
  const imageUrl = useBaseUrl(image);

  return (
    <figure className={styles.game}>
      <img
        className={styles.screenshot}
        src={imageUrl}
        alt={`${title}游戏实机截图`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={styles.caption}>
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        <p className={styles.description}>{description}</p>
      </figcaption>
    </figure>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features} aria-labelledby="homepage-games-title">
      <div className="container">
        <Heading as="h2" id="homepage-games-title" className={styles.sectionTitle}>
          Vulcal Engine 示例小游戏
        </Heading>
        <div className={styles.games}>
          {games.map((game) => (
            <GamePreview key={game.title} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
}
