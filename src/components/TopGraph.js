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

          const results = data.map((obj, i) => {
            let p = { ...obj };
            p.color = determineColor(obj.deficit);
            return p;
          });
          // console.log(results);

          const ciccio = levels.map((level, i) => {
            let p = { ...level };
            p.header =
              i === 0 ? "" : format(new Date(results[i - 1].date), "MMM EEE d");
            return p;
          });

          // console.log(ciccio);

          const nello = ciccio.map(level => {
            let p = { ...level };

            p.dayOne =
              level.color === results[0].color ? results[0].deficit : null;
            p.dayTwo =
              level.color === results[1].color ? results[1].deficit : null;
            p.dayThree =
              level.color === results[1].color ? results[2].deficit : null;

            // console.log(p);
            return p;
          });

          // console.log(nello);
          return (
            <Grid container>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {nello.map(d => (
                      <TableCell
                        key={d.id}
                        padding="none"
                        style={{ border: "none", textAlign: "center" }}
                      >
                        {d.header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nello.map(d => {
                    return (
                      <TableRow
                        key={d.id}
                        style={{
                          border: "none",
                          borderLeft: `16px solid ${d.color}`,
                          height: 70
                        }}
                      >
                        <TableCell
                          padding="none"
                          style={{
                            border: "none",
                            paddingLeft: 8,
                            color: "rgba(0, 0, 0, 0.54)"
                          }}
                        >
                          {d.name}
                        </TableCell>
                        <TableCell
                          padding="none"
                          style={{
                            border: "none",
                            textAlign: "center"
                          }}
                        >
                          {d.dayOne}
                        </TableCell>
                        <TableCell
                          padding="none"
                          style={{ border: "none", textAlign: "center" }}
                        >
                          {d.dayTwo && (
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                background: d.color,
                                borderRadius: "50%",
                                margin: "0 auto"
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell
                          padding="none"
                          style={{ border: "none", textAlign: "center" }}
                        >
                          {d.dayThree && (
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                background: d.color,
                                borderRadius: "50%",
                                margin: "0 auto"
                              }}
                            />
                          )}
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
