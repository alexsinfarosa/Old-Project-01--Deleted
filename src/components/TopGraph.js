import React, { Component } from "react";
import { AppConsumer } from "../AppContext";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import format from "date-fns/format";
import { withHandlers } from "recompose";

const medium = {
  wiltingpoint: 2.0,
  prewiltingpoint: 2.225,
  stressthreshold: 2.8,
  fieldcapacity: 3.5,
  saturation: 5.5
};

const levels = [
  {
    name: "No Deficit",
    color: "#2E933C",
    treshold: medium.saturation - medium.fieldcapacity
  },
  {
    name: "Deficit, No Stress",
    color: "#F9DC5C",
    treshold: medium.stressthreshold - medium.fieldcapacity
  },
  {
    name: "Deficit, Stress",
    color: "#FC9E4F",
    treshold: medium.prewiltingpoint - medium.fieldcapacity
  },
  {
    name: "Severe Stress",
    color: "#BA2D0B",
    treshold: medium.wiltingpoint - medium.fieldcapacity
  }
];

const styles = theme => ({
  root: {},
  table: {}
});

class TopGraph extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppConsumer>
        {context => {
          const { dataModel } = context;
          const today = format(new Date(), "MM/d/YYYY");
          const todayIdx = dataModel.findIndex(obj => obj.date === today);
          const todayPlus2 = dataModel.slice(todayIdx, todayIdx + 3);
          console.log(todayPlus2);
          return (
            <Grid container>
              <Table style={{ width: window.innerWidth }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{todayPlus2[0].date}</TableCell>
                    <TableCell>{todayPlus2[1].date}</TableCell>
                    <TableCell>{todayPlus2[2].date}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayPlus2.map(row => {
                    console.log(row);
                    return (
                      <TableRow key={row.date}>
                        <TableCell component="th" scope="row">
                          {row.deficit.toPrecision(1)}
                        </TableCell>
                        <TableCell numeric>{row.calories}</TableCell>
                        <TableCell numeric>{row.fat}</TableCell>
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
