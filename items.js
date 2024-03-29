const myButton = document.querySelector('.button');
const inputValue = document.querySelector('.inputValue');
const name = document.querySelector('.name');
const temp = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');
const rain = document.querySelector('.rain');

myButton.addEventListener('click', function () {
  fetch(
    'http://api.openweathermap.org/data/2.5/weather?q=' +
      inputValue.value +
      '&units=metric&appid=ff63e461b260df94ca95f55c74377523')
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      let description = document.querySelector('.desc');
      description.classList.add('my-bg-effect','my-border');
      const nameValue = data['name'];
      const tempValue = data['main']['temp'];
      const humidityValue = data['main']['humidity'];
      let prepValue;
      if (!(data['rain'] === undefined)) prepValue = data['rain']['1h'];
      else prepValue = '0';
      //console.log(data);

      name.innerHTML = nameValue;
      temp.innerHTML = 'Temperature: ' + Math.round(tempValue) + ' °C';
      humidity.innerHTML = 'Humidity: ' + Math.round(humidityValue) + ' %';
      rain.innerHTML = 'Precipitation: ' + prepValue + ' mm';
    });
    getForecast();
    //const currentDate = getForecast();
    //console.log(currentDate);
    //let myDate = '';
    let forecast = document.getElementById('forecast');
    forecast.classList.add('my-bg-effect','my-border');
    async function getForecast(){
    const res = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${inputValue.value}&units=metric&APPID=ff63e461b260df94ca95f55c74377523`);
    const data = await res.json();
      //console.log(data);
      
      //myDate = data.list['0']['dt_txt'];
      //console.log(myDate);
      let heading = '<h4 class="my-bg-effect">Forecast for next 3 days</h4>'
      forecast.innerHTML += heading;
      // let myOutput = '<div class ="row justify-content-center">'
          for(let i=0;i<=16;i = i + 8){
        let myOutput = `
              <ul class="parameters my-bg-effect my-border col-sm-4">
              <li class="pTemp my-bg-effect">Temperature: ${Math.round(data.list[i].main.temp)} °C</li>
              <li class="pHumid my-bg-effect">Humidity: ${Math.round(data.list[i].main.humidity)} %</li>`;

        if (data.list[i].rain !== undefined) {
          myOutput += `<li class="pRain my-bg-effect">Precipitation: ${data.list[i].rain['3h']} mm</li>`;
        }
        else
        myOutput += `<li class="pRain my-bg-effect">Precipitation: 0 mm</li>`;

        myOutput += '</ul>';
        // myOutput += '</div>';
        
        forecast.innerHTML += myOutput;
      }

    //return myDate;
  }
    //console.log(myDate);
charIt();

    async function charIt(){
    const ctx = document.getElementById('myChart').getContext('2d');
    const dataTemps = await getValues();
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataTemps.date,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: dataTemps.temp,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
              {
                label: 'Humidity (%)',
                data: dataTemps.humid,
                backgroundColor: 'rgba(173, 216, 230, 0.2)',
                borderColor: 'rgba(0, 0, 139, 1)',
                borderWidth: 1
              },
              {
                label: 'Precipitation (mm)',
                data: dataTemps.rain,
                backgroundColor: 'rgba(144, 238, 144, 0.2)',
                borderColor: 'rgba(0, 100, 0, 1)',
                borderWidth: 1
              },
            ]
        },
        options: {}
    });
  }
    async function getValues(){
      let dateTo = moment().format('YYYY-MM-DD') + 'T00:00:00';
    let dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD') + 'T00:00:00';
    const res = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${dateFrom}&endDateTime=${dateTo}&unitGroup=uk&contentType=csv&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${inputValue.value}&key=7AU1HQ21ZPCVB2QD1Z1ZFFI4K`
    );
      const data = await res.text();
      const date = [];
      const temp = [];
      const humid = [];
      const rain = [];
      const table = data.split('\n').slice(1,8);
      //console.log(table);
      table.forEach(rows => {
        const cols = rows.split(',');
        date.push(cols[1]);
        temp.push(parseFloat(cols[4]));
        humid.push(parseFloat(cols[6]));
        rain.push(parseFloat(cols[12]));
        //console.log(date, temp, humid, rain);
      });
      return { date, temp, humid, rain};
    }
});
//const myDate = Date.now();
//console.log(myDate);