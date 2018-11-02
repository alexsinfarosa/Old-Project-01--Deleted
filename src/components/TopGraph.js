import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import format from "date-fns/format";
import { determineColor } from "../utils/utils";

const levels = [
  {
    id: 0,
    name: "No Deficit",
    color: "#2E933C"
  },
  {
    id: 1,
    name: "Deficit, No Stress",
    color: "#F9DC5C"
  },
  {
    id: 2,
    name: "Deficit, Stress",
    color: "#FC9E4F"
  },
  {
    id: 3,
    name: "Severe Stress",
    color: "#BA2D0B"
  }
];

const styles = theme => ({
  root: {},
  rowHeader: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  rowLevel: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center"
  }
});

class TopGraph extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel, irrigationDate } = context;
          const irriDate = format(new Date(irrigationDate), "MM/dd/YYYY");
          const irrigationDayIdx = dataModel.findIndex(
            obj => obj.date === irriDate
          );
          const data = dataModel.slice(irrigationDayIdx, irrigationDayIdx + 3);

          const results = data.map(obj => {
            let p = { ...obj };
            p.color = determineColor(obj.deficit);

            return p;
          });
          // console.log(results);

          const ciccio = levels.map((level, i) => {
            let p = { ...level };
            p.header =
              i === 0
                ? "Threshold"
                : format(new Date(results[i - 1].date), "EEE d");

            let m = {};
            results.map(obj => {
              m.dayOne = p.color === obj.color ? results[0].deficit : null;
              m.dayTwo = p.color === obj.color ? results[1].deficit : null;
              m.dayThree = p.color === obj.color ? results[2].deficit : null;
              return m;
            });

            return { ...p, ...m };
          });

          console.log(ciccio);
          return (
            <Grid container>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {ciccio.map(d => (
                      <TableCell
                        key={d.id}
                        padding="none"
                        style={{ paddingLeft: 8 }}
                      >
                        {d.header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ciccio.map(d => {
                    return (
                      <TableRow
                        key={d.id}
                        style={{ background: d.color, height: 70 }}
                      >
                        <TableCell padding="none" style={{ paddingLeft: 8 }}>
                          {d.name}
                        </TableCell>
                        <TableCell
                          padding="none"
                          style={{
                            paddingLeft: 8,
                            fontSize: 16,
                            fontWeight: "bold"
                          }}
                        >
                          {d.dayOne}
                        </TableCell>
                        <TableCell padding="none" style={{ paddingLeft: 8 }}>
                          {d.dayTwo}
                        </TableCell>
                        <TableCell padding="none" style={{ paddingLeft: 8 }}>
                          {d.dayThree}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withRoot(withStyles(styles)(TopGraph));
