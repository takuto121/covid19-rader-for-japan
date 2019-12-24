import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import FeatureLayout from './FeatureLayout'
import Title from './Title'
interface Props {
}
interface State {}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const FeatureTopSection: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      	<Title title={"さあ、トレードの質を向上しよう"} color={"#FFFFFF"}/>
        <Divider />
        <FeatureLayout
          isRight={true}
          title={"カレンダーで取引を振り返る"}
          text={"カレンダー機能で日毎の損益を一目で確認することができます。"}
        />
        <FeatureLayout
          isRight={false}
          title={"取引をした理由が一目瞭然"}
          text={"取引の動機が一覧になっているため、なぜそのタイミングで取引をしたのかを簡単に振り返ることができます"}
        />
        <FeatureLayout
          isRight={true}
          title={"あなたの取引を徹底的に分析"}
          text={"あなたの取引記録から自動で分析します。期待値や破産の確率など、他にはない豊富な統計機能で徹底的に洗い出します。"}
        />
        <FeatureLayout
          isRight={false}
          title={"FXや株、仮想通貨などに対応"}
          text={"FX、株、仮想通貨など様々な取引形態に対応しています。それぞれシンプルな登録フォームで簡単に記入できます。"}
        />
    </div>
 
  );
}

export default FeatureTopSection;