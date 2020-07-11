import React from "react";
import PropTypes from "prop-types";
import "./App.css";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function Champion({ champ, onclick }) {
  const nameDense = champ.name.replace(" ", "").replace("'", "").toLowerCase();
  const imgLink = `dataset/champions/${nameDense}.png`;
  return (
    <Box p={0.5}>
      <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        variant={champ.selected ? "dot" : "standard"}
      >
        <Avatar alt={champ.name} src={imgLink} onClick={onclick} />
      </StyledBadge>
    </Box>
  );
}

function SelectedChampion({ champ, onLevelDownClick, onLevelUpClick }) {
  const nameDense = champ.name.replace(" ", "").replace("'", "").toLowerCase();
  const imgLink = `dataset/champions/${nameDense}.png`;
  return (
    <Badge badgeContent={champ.level} color="primary">
      <Box p={0.5}>
        <Avatar alt={champ.name} src={imgLink} />

        <IconButton aria-label="reduce" size="small" onClick={onLevelDownClick}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="increase" size="small" onClick={onLevelUpClick}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Badge>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { champs: [], picked: [], progress: 0 };
  }
  componentDidMount() {
    axios.get("dataset/champions.json").then((response) => {
      if (response.request.status === 200) {
        this.setState({
          champs: [...response.data].sort((a, b) => a.cost - b.cost),
        });
      }
    });
  }

  onChampClick(champ) {
    const newChamp = [...this.state.champs];
    const pickedList = [...this.state.picked];

    newChamp.forEach((c) => {
      if (c.name === champ.name) {
        if (c.selected) {
          c.selected = false;
          for (let i = 0; i < pickedList.length; i += 1) {
            if (pickedList[i].name === champ.name) {
              pickedList.splice(i, 1);
              break;
            }
          }
        } else {
          if (pickedList.length === 9) {
            console.log("you picked more than 9");
            return;
          }
          c.selected = true;
          champ.level = 1;
          pickedList.push(champ);
        }
      }
    });
    this.setState({
      picked: [...pickedList].sort((a, b) => a.cost - b.cost),
      champs: newChamp,
      progress: 100 * (pickedList.length / 9),
    });
  }

  onLevelClick(champ, value) {
    const pickedList = [...this.state.picked];
    for (let i = 0; i < pickedList.length; i += 1) {
      if (pickedList[i].name === champ.name) {
        const level = pickedList[i].level + value;
        if (level >= 1 && level <= 3) {
          pickedList[i].level = level;
        }
        break;
      }
    }
    this.setState({ picked: [...pickedList] });
  }

  render() {
    return (
      <div className="App">
        <Container>
          <h3>챔피언 목록</h3>
          {[1, 2, 3, 4, 5].map((cost, index) => {
            return (
              <Box
                flexWrap="nowrap"
                display="flex"
                flexDirection="row"
                p={0.5}
                m={0.5}
                key={index}
              >
                {this.state.champs
                  .filter((champ) => champ.cost === cost)
                  .map((champ, i) => {
                    return (
                      <Champion
                        onclick={() => this.onChampClick(champ)}
                        champ={champ}
                        key={i}
                      />
                    );
                  })}
              </Box>
            );
          })}
        </Container>
        <Divider component="div" />

        <Container>
          <h3>나의 덱</h3>
          <Box
            flexWrap="nowrap"
            display="flex"
            flexDirection="row"
            p={0.5}
            m={0.5}
          >
            {this.state.picked.map((pick, i) => {
              return (
                <SelectedChampion
                  champ={pick}
                  key={i}
                  onLevelDownClick={() => this.onLevelClick(pick, -1)}
                  onLevelUpClick={() => this.onLevelClick(pick, 1)}
                />
              );
            })}
          </Box>
        </Container>

        <Divider component="div" />

        <Container>
          <h3>덱 완성도</h3>
          <LinearProgressWithLabel value={this.state.progress} />
        </Container>
      </div>
    );
  }
}

export default App;
