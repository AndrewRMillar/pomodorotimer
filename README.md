# ![Tomato](https://github.com/andrewrmillar/pomodorotimer/blob/master/favicon-32x32.png?raw=true) Pomodoro Timer
A timer app for the [pomodoro](https://francescocirillo.com/pages/pomodoro-technique) time management technique, with notifications on completion of the timer.
The page includes a relatively short explanation on the Pomodoro technique copied from the official documentation 

[Link](https://andrewrmillar.github.io/pomodorotimer/) to the github page version of the timer

## Gulp
Changing the repo to a Gulp project. Had to change the folder from where github pages was served using the following command `git subtree push --prefix dist origin gh-pages`, which worked like a charm. It seems like I have to keep executing that command when I change something in my other branch, but that seems unlikely so I must be missing something. 

To use the Gulp version run the following commands in the terminal after downloading the repo (eventhough the dist folder is already there):
```sh
npm install
gulp
```
You can run `gulp watch` when you wish to change the code and use live reload functionality.
