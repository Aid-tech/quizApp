let answer, userAnswer, oldChoice;
if(localStorage.getItem('positive') == null) localStorage.setItem('positive', 0);
if(localStorage.getItem('negative') == null) localStorage.setItem('negative', 0);

function quizRandom (){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status < 300)) {
            const arr = this.response;
            const incorrects = arr.results[0].incorrect_answers;
            const index = Math.floor(Math.random() * parseInt(incorrects.length + 1));
            answer = arr.results[0].correct_answer.trim();
            console.log(answer)
            const answers = insertRandom (incorrects, index, answer);
            document.getElementById('category').textContent = arr.results[0].category;
            document.getElementById('question').textContent = arr.results[0].question;
            let balO = balF = '';
            if(answers.length == 2) {
                balO = '<!--';
                balF = '-->';
            }
            document.getElementById('response').innerHTML = `
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-5 mx-1 py-2">${answers[0]}</div>
                    <div class="col-md-5 mx-1 py-2">${answers[1]}</div>
                </div>
                ${balO}
                <div class="row mt-2">
                    <div class="col-md-1"></div>
                    <div class="col-md-5 mx-1 py-2">${answers[2]}</div>
                    <div class="col-md-5 mx-1 py-2">${answers[3]}</div>
                </div>
                ${balF}
            `;
            document.querySelectorAll('.mx-1').forEach(res => {
                res.addEventListener('click', ()=>{
                    userAnswer = res.textContent.trim();
                    if (oldChoice != undefined){

                        if(res.textContent != oldChoice.textContent){
                            oldChoice.style.backgroundColor = '#ffc107';
                            oldChoice = res;
                        }
                    } else{
                        oldChoice = res;
                    }
                    res.style.backgroundColor = '#198754';
                });
            });
        } else if (this.readyState == 4 && this.status == 404) {
            alert('Erreur 404 :/');
        }
    };
    xhr.open("GET", "https://opentdb.com/api.php?amount=1", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.responseType = "json";
    xhr.onerror = function () { 
        quizRandom ();
        answer =  userAnswer = oldChoice = undefined;
    }; 
    xhr.send();

    document.getElementById('gain').textContent = localStorage.getItem('positive');
    document.getElementById('perte').textContent = localStorage.getItem('negative');
}

document.addEventListener("DOMContentLoaded", () => {
    quizRandom ();
});

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', ()=> {
        if(btn.getAttribute('data-value') == 'check'){
           
            if(userAnswer != undefined){
                if(answer == userAnswer) {
                    let positive = parseInt(localStorage.getItem('positive')) + 1;
                    localStorage.setItem('positive', positive);
                } else {
                    let negative = parseInt(localStorage.getItem('negative')) + 1;
                    localStorage.setItem('negative', negative);
                }
                document.getElementById('response') == '';
                quizRandom ();
            } else {
                alert('Veuillez cliquer sur une reponse')
            }
            userAnswer = undefined;
        } else {
            localStorage.setItem('positive', 0);
            localStorage.setItem('negative', 0);
            document.getElementById('gain').textContent = localStorage.getItem('positive');
            document.getElementById('perte').textContent = localStorage.getItem('negative');
        }
    });
});

function insertRandom (arr, index, newItem) {
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}