import React, { useEffect, useState } from 'react';
import { Modal, Input,Button } from 'semantic-ui-react';
import axios from 'axios'

const App = (props) => {
    const [amt, setAmt] = useState(300);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false)

    const DEFAULT_HEADER = () => {
        return { headers:
            {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjE5NzI1ODYsImFjdGl2YXRlZCI6dHJ1ZSwicm9uaW5BZGRyZXNzIjoiMHg1ZWFiNmExNDdmOTk0YWUxZmMxN2EzNTc1MDZmMWIwMTY3ZjUxMjE4IiwiZXRoQWRkcmVzcyI6bnVsbCwiaWF0IjoxNjI4NTI2MjMxLCJleHAiOjE2MjkxMzEwMzEsImlzcyI6IkF4aWVJbmZpbml0eSJ9.99vK37aEmMvXKJKlvQjl4AmZ_xRYHBgxG4IrTErgX3I"
            },
            timeout:120000
        }
    }
    const DEFAULT_PAYLOAD = () => {
        return {"operationName":"GetAxieLatest","variables":{"from":0,"size":100,"sort":"Latest","auctionType":"Sale"},"query":"query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"}
    }

    const search = (e) => {
        e.preventDefault();
        const payload = DEFAULT_PAYLOAD();
        const header = DEFAULT_HEADER();

        axios.post('https://axieinfinity.com/graphql-server-v2/graphql', payload)
            .then(async res => {
                const result = res.data.data.axies.results.filter((obj) => {
                    console.log(obj.auction.currentPriceUSD);
                    console.log(amt);
                    return parseFloat(obj.auction.currentPriceUSD) <= amt;
                }
            );
            console.log(result);

                setData(result);
            })
            .catch(err => {
                setOpen(true)
            })
    }
    const onChangeAmt = (e) => {
        e.preventDefault();
        setAmt(e.target.value);
    }
  return (
    <div className="app">
    <h3>Search the lowest price of axies on the market!</h3>
    <Input
        placeholder="Enter amount in USD"
        value={amt}
        onChange={onChangeAmt}
      />
      <button className="ui primary button" type="button"  onClick={search}>Filter</button>

      <table className="ui celled table">
          <thead className="">
          <tr className="">
              <th className="">id</th>
              <th className="">Price USD</th>
              <th className="">Class</th>
              <th className="">Breed Count</th>
              <th className="">Picture</th>
          </tr>
      </thead>
      <tbody className="">
      {
          data?.map((obj,i) => {
              return (
                  <tr  key={i}>
                      <td className=""><a href={"https://marketplace.axieinfinity.com/axie/"+obj.id} target="_blank">{obj.id}</a></td>
                      <td className="">{obj.auction.currentPriceUSD}</td>
                      <td className="">{obj.class}</td>
                      <td className="">{obj.breedCount}</td>
                      <td className=""><img src={obj.image}width="50"/></td>
                  </tr>
              )
          })
      }
      </tbody>
      </table>
      <Modal
      centered={false}
      open={open}
      size={'small'}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>Server down!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Puta server down nga ei!
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>

    </div>
  );
}

export default App;
