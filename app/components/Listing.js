import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, List, ListItem, Divider } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import { dbUrl, RootNavigator } from '../../App';
import { Table, Row, Rows,} from 'react-native-table-component';
import { LineChart, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { getValuationPrice } from '../utils';

export default class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {}
    };
  }

  componentDidMount() {
    const listingId = Number(this.props.navigation.state.params.id);
    axios.get(dbUrl + `/api/listings/${listingId}`)
      .then(res => res.data)
      .then(listing => this.setState({ listing }))
      .catch(err => console.error(err));
  }

  render() {
    let x = [];
    let y = [];
    let data = [];
    const tableHead = ['Date', 'Price'];
    let tableData = [];
    if (this.state.listing.valuations) {
        tableData = this.state.listing.valuations.map(valuation => {
        return [valuation.createdAt.slice(0,10), getValuationPrice(valuation)];
        });
        x = this.state.listing.valuations.map(valuation =>  valuation.createdAt.slice(0,10));
        y = this.state.listing.valuations.map(valuation => getValuationPrice(valuation));
    }
    const contentInset = { top: 20, bottom: 20 }
    return (
      <View>
      <Card title={this.state.listing.name}>
      <Table>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} style={styles.row} textStyle={styles.text}/>
        </Table>
        <Divider/>
        <View style={ { height: 200, flexDirection: 'row' } }>
          <YAxis
            dataPoints={ y }
            labelStyle={ { color: 'grey' } }
            contentInset={ contentInset }
          />
          <LineChart
            style={ { flex: 1, marginLeft: 16 } }
            dataPoints={ y }
            fillColor={ 'purple' }
            shadowOffset={1}
            svg={ {
                stroke: 'rgb(134, 65, 244)',
            } }
            shadowSvg={ {
                stroke: 'rgba(134, 65, 244, 0.2)',
                strokeWidth: 5,
            } }
            contentInset={ { top: 20, bottom: 20 } }
            curve={shape.curveLinear}
          />
          <XAxis
            values= {x}
            labelStyle={ { color: 'grey' } }
            contentInset={ contentInset }
            chartType={ XAxis.Type.LineChart }
            style={ { paddingVertical: 16 } }
          />
       </View>
      </Card>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { marginLeft: 5 },
  row: { height: 30 }
})
