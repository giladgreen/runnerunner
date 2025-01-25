'use client';
import React from 'react';
const MIN_PRIZE = 4000;
const array = Array.from({ length: 15 }, (_, i) => 20 - i);

function distributePercentages(numPeople: number) {
  if (numPeople < 1) {
    return [];
  }

  const totalWeight = numPeople * (numPeople + 1) / 2;
  const percentageStep = 100 / totalWeight;
  return Array.from({ length: numPeople }, (_, i) => Math.round(percentageStep * (i + 1)));
}

const options = array
  .map((numberOfPlayers) => {
    const percentages = distributePercentages(numberOfPlayers);
    const calc = (index: number) => percentages[numberOfPlayers-index];

    return{
    numberOfPlayers,
    calc
  }
});


console.log('## options', options);
export default function CalcCashPrizes() {
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [minPrize, setMinPrize] = React.useState(4000);
  const adjustedAmount = totalAmount * 275 / 400;
  let values: Array<{ percentage:number, amount:number}> = [];
  let numberOfPeople = 0;
  const object = options.find((option) => (option.calc(1) * adjustedAmount / 100 ) > minPrize);
  if (object) {
    console.log('## object', object);
     numberOfPeople = object.numberOfPlayers;
    const calcFunction =object.calc;
     values = Array.from({ length: numberOfPeople }, (_, i) => {
       const percentage = calcFunction(i + 1);
       const amount = percentage * adjustedAmount / 100
       return {
         percentage,
         amount
       }
     });
    console.log('## values', values);

  }

  return (
    <div>
      <div
        className="config-section rtl"
        style={{ marginTop: 130, textAlign: 'right' }}
      >
        <h1 className="text-2xl">חישוב פרסים במזומן</h1>
        <div className="config-section" style={{ width: '100%', fontSize: 17 }}>
          <div>הכנס פרס מינימלי למקום הראשון</div>
          <input
            min={0}
            type="number"
            id="minPrize"
            style={{ color: 'var(--black)' }}
            value={minPrize}
            onChange={(e) => {
              setMinPrize(Number(e.target.value));
            }}
          />
          <div>הכנס את הסכום הכולל של כל הכסף שנכנס בערב</div>
          <input
            min={0}
            type="number"
            id="totalAmout"
            style={{ color: 'var(--black)' }}
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(Number(e.target.value));
            }}
          />

          {numberOfPeople > 0 && (
            <div>הסכום נטו לחלוקה:{adjustedAmount}	₪</div>
          )}
          {numberOfPeople > 0 && (
            <div>מספר האנשים שיקבלו פרס:{numberOfPeople}</div>
          )}
          {numberOfPeople > 0 && <div>פירוט:</div>}
          {numberOfPeople > 0 && (
            <div>
              <table className="calc-table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>אחוז</th>
                  <th>סכום</th>
                </tr>
                </thead>
                <tbody>
                {values.map((value, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{value.percentage}%</td>
                    <td>{Math.floor( value.amount / 100) * 100}	₪</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
