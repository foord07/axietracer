import React, { useState } from 'react';
import { Modal, Input,Button,Dropdown,Dimmer,Loader,Popup } from 'semantic-ui-react';
import axios from 'axios'
import _ from 'lodash';

const App = (props) => {
    const [amt, setAmt] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [breed, setBreed] = useState("any");
    const [classAxie, setClassAxie] = useState("any");
    const [isLoading, setIsLoading] = useState(false);

    const DEFAULT_PAYLOAD = () => {
        return {"operationName":"GetAxieLatest","variables":{"from":0,"size":100,"sort":"Latest","auctionType":"Sale"},"query":"query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"}
    }

    const search = (amt,breed,classAxie) => {
        const payload = DEFAULT_PAYLOAD();
        setIsLoading(true);
        axios.post('https://axieinfinity.com/graphql-server-v2/graphql', payload)
            .then(async res => {
                if(res.data.data.axies.results.length===0){
                    setOpen(true);
                }else {
                    let result = res.data.data.axies.results.filter((obj) => {
                        return parseFloat(obj.auction.currentPriceUSD) <= amt;
                    });
                    if(breed !== "any"){
                        result = result.filter((obj) => {
                            return parseFloat(obj.breedCount) === breed;
                        });
                    }
                    if(classAxie !== "any"){
                        result = result.filter((obj) => {
                            return obj.class === classAxie;
                        });
                    }

                    result = _.sortBy(result, ["auction.currentPriceUSD"]);
                    setData(result);
                }
                setIsLoading(false);

            })
            .catch(err => {
                setOpen(true);
                setIsLoading(false);
            })
    }
    const onChangeAmt = (e) => {
        e.preventDefault();
        setAmt(e.target.value);
        if(e.target.value !== "" && e.target.value !==amt){
            search(e.target.value,breed,classAxie);
        }
    }

    const breedOptions = [
        { key: 1, text: 'Any', value: "any" },
        { key: 2, text: '0', value: 0 },
        { key: 3, text: '1', value: 1 },
        { key: 4, text: '2', value: 2 },
        { key: 5, text: '3', value: 3 }
    ]
    const classOptions = [
        { key: 1, text: 'Any', value: "any" },
        { key: 2, text: 'Aquatic', value: 'Aquatic' },
        { key: 3, text: 'Beast', value: 'Beast'},
        { key: 4, text: 'Plant', value:'Plant' },
        { key: 5, text: 'Bird', value: 'Bird' },
        { key: 6, text: 'Bug', value: 'Bug' },
        { key: 7, text: 'Reptile', value: 'Reptile' },
        { key: 8, text: 'Mech', value: 'Mech' },
        { key: 9, text: 'Dawn', value: 'Dawn' },
        { key: 10, text: 'Dusk', value: 'Dusk' }
    ]
    const handleDropdownBreed = (e, { value }) => {
        setBreed(value);
        search(amt,value,classAxie);
    }
    const handleDropdownClass = (e, { value }) => {
        setClassAxie(value);
        search(amt,breed,value);
    }

  return (
    <div className="app">
    <h3>Search axies that are <strong>"RECENTLY"</strong> listed on the marketplace!</h3>
    <div className="filter-box">
        <div className="row-group">
            <label>Enter Amount (USD)</label>
            <Input
                placeholder="Enter amount in USD"
                onBlur={onChangeAmt}
              />
        </div>
        <div className="row-group">
            <label>Breed Count</label>
            <Dropdown
              icon='caret down'
              placeholder="Select Breed Count"
              selection
              selectOnBlur={false}
              options={breedOptions}
              value={breed}
              onChange={handleDropdownBreed}
              />
          </div>
          <div className="row-group">
              <label>Class</label>
              <Dropdown
                  icon='caret down'
                  placeholder="Select Class"
                  selection
                  selectOnBlur={false}
                  options={classOptions}
                  value={classAxie}
                  onChange={handleDropdownClass}
              />
          </div>
      </div>

      <table className="ui celled table tbl-box">
          <thead className="">
          <tr className="">
              <th className="">ID</th>
              <th className="">Price USD</th>
              <th className="">Class</th>
              <th className="">Breed Count</th>
              <th className="">Picture</th>
          </tr>
      </thead>
      <tbody className="">

      {
          data.length>1 ?
              data.map((obj,i) => {
                  return (
                      <tr  key={i}>
                          <td className=""><a rel="noreferrer" href={"https://marketplace.axieinfinity.com/axie/"+obj.id} target="_blank">{obj.id}</a></td>
                          <td className="">{obj.auction.currentPriceUSD}</td>
                          <td className="">{obj.class}</td>
                          <td className="">{obj.breedCount}</td>
                          <td className="">
                                <img alt="" src={obj.image} width="40"/>
                                {
                                    obj.parts[2]?.abilities[0]?.name ?
                                <Popup
                                on='click'
                                trigger={<Button>Details</Button>}
                                 content={<div dangerouslySetInnerHTML={{ __html: '<div class="skill-box"><div class="stats"><span class="hp">HP: '+obj.stats?.hp+'</span><span class="speed">Speed: '+obj.stats?.speed+'</span><span class="skill">Skill: '+obj.stats?.skill+'</span><span class="morale">Morale: '+obj.stats?.morale+'</span></div><div class="box-row"><span class="energy">'+obj.parts[2]?.abilities[0]?.energy+'</span><span class="attack">'+obj.parts[2]?.abilities[0]?.attack+'</span><span class="def">'+obj.parts[2]?.abilities[0]?.defense+'</span><span>'+obj.parts[2]?.abilities[0]?.name+'</span><img src="'+obj.parts[2]?.abilities[0]?.backgroundUrl+'" alt="" /><label>'+obj.parts[2]?.abilities[0]?.description+'</label></div><div class="box-row"><span class="energy">'+obj.parts[3]?.abilities[0]?.energy+'</span><span class="attack">'+obj.parts[3]?.abilities[0]?.attack+'</span><span class="def">'+obj.parts[3]?.abilities[0]?.defense+'</span><span>'+obj.parts[3]?.abilities[0]?.name+'</span><img src="'+obj.parts[3]?.abilities[0]?.backgroundUrl+'" alt="" /><label>'+obj.parts[3]?.abilities[0]?.description+' </label></div><div class="box-row"><span class="energy">'+obj.parts[4]?.abilities[0]?.energy+'</span><span class="attack">'+obj.parts[4]?.abilities[0]?.attack+'</span><span class="def">'+obj.parts[4]?.abilities[0]?.defense+'</span><span>'+obj.parts[4]?.abilities[0]?.name+'</span><img src="'+obj.parts[4]?.abilities[0]?.backgroundUrl+'" alt="" /><label>'+obj.parts[4]?.abilities[0]?.description+' </label></div> <div class="box-row"><span class="energy">'+obj.parts[5]?.abilities[0]?.energy+'</span><span class="attack">'+obj.parts[5]?.abilities[0]?.attack+'</span><span class="def">'+obj.parts[5]?.abilities[0]?.defense+'</span><span>'+obj.parts[5]?.abilities[0]?.name+'</span><img src="'+obj.parts[5]?.abilities[0]?.backgroundUrl+'" alt="" /><label>'+obj.parts[5]?.abilities[0]?.description+' </label></div></div>'
                             }} />}
                                 position='left center'
                               />
                               : ""
                               }
                          </td>
                      </tr>
                  )
              })
              : <tr><td>No records Found!</td></tr>
      }
      </tbody>
      </table>

      <Dimmer className={isLoading ? "active": ""}>
       <Loader content='Loading' />
     </Dimmer>
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
            <i className="info circle"></i>
            Oh nose! Server down! check here if you dont believe <a href="https://marketplace.axieinfinity.com/" target="_blank">https://marketplace.axieinfinity.com/</a>
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
