var term = new Terminal()
term.open(document.getElementById('terminal'));
var command = [];
var data;
var countries = {};

var TotalDeaths;
var TotalConfirmed;
var TotalRecovered;

var p = "Here is a list of commands you can use\r\n1. corona get all\r\n2. corona get country <country_name>\r\n3. corona get help\r\n\r\n$ ";

const BASE_URL = 'https://api.covid19api.com/summary'


function runFakeTerminal() {
    if (term._initialized) {
        return;
    }

    axios.get(BASE_URL, {})
    .then((response) => {
        console.log(response.data);
        data = response.data;
        for(let i = 0; i < data.Countries.length; i++){
            countries[data.Countries[i].Country] = data.Countries[i];
        }
    }).catch((e) => {
        console.log(e);
    })

    term._initialized = true;

    term.prompt = () => {
        term.write('\r\n$ ');
    };

    term.writeln('Welcome to the corona cli');
    term.writeln('Use corona --help for help');
    term.writeln('Get updated with the latest news!');
    term.writeln('');
    prompt(term);

    term.onKey(e => {

        var today = new Date();
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;


        const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

        if (e.domEvent.keyCode === 13) {
            var word = ""
            for(const letter of command){
                word += letter
            }
            command = [];

            if(word === 'corona --help'){
                prompt(term);
                term.write(p);
            }else if(word === 'corona get all'){

                TotalConfirmed = data.Global.TotalConfirmed;
                TotalRecovered = data.Global.TotalRecovered;
                TotalDeaths = data.Global.TotalDeaths;

                var op = "\r\n\r\nAs of " + dateTime + " the World has: \r\n\r\nTotal Confirmed Cases : " + TotalConfirmed + "\r\nTotal Recovered : " + TotalRecovered + "\r\nTotal Deaths : " + TotalDeaths + "\r\n ";
                term.write(op);
                prompt(term);
            }else if(word.includes('corona get country')){

                var country = word.split('country')[1].trim()

                if(countries[country] == undefined){
                    term.write('\r\nCan\'t find details of the entered country!\r\n');
                    prompt(term);
                }else{
                    var temp_data = countries[country]

                    TotalConfirmed = temp_data.TotalConfirmed;
                    TotalRecovered = temp_data.TotalRecovered;
                    TotalDeaths = temp_data.TotalDeaths;
    
                    var op = "\r\n\r\nAs of " + dateTime + " " + country + " has: \r\n\r\nTotal Confirmed Cases : " + TotalConfirmed + "\r\nTotal Recovered : " + TotalRecovered + "\r\nTotal Deaths : " + TotalDeaths + "\r\n ";
                    term.write(op);
                    prompt(term);
                }
            }else if(word === 'clear'){
                term.clear()
                prompt(term)
            }else{
                term.write('\r\n Command not found! Use corona --help for help')
                prompt(term);
            }

        } else if (e.domEvent.keyCode === 8) {
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
                var a = command.pop()
            }
        } else if (printable) {
            command.push(e.key)
            term.write(e.key);
        }
    });
}

function prompt(term) {
    term.write('\r\n$ ');
}
runFakeTerminal();