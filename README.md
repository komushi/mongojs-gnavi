# mongojs-gnavi for pcf

## Live Demo
[DEMO](http://angular-gnavi-express.herokuapp.com/)

## DataSource

[ぐるなびWebサービス](http://api.gnavi.co.jp)

### 都道府県

```
http://api.gnavi.co.jp/ver1/PrefSearchAPI/?keyid=<your_api_key>&format=json
```


### エリア

```
http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=<your_api_key>&format=json
```


### カテゴリ

```
http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=<your_api_key>&format=json
```


### レストラン

```
http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=<your_api_key>&category_l=RSFST09000&area=AREA110&hit_per_page=1&format=json
```


## Getting Started

All you need to do is to clone this repository,
```
git clone https://github.com/komushi/mongojs-gnavi
cd angular-gnavi
```

Remeber to install [node.js and npm](http://nodejs.org/) and then [bower](http://bower.io/) first.
Then, install the dependencies:
```
npm install
```

Then, run the Application:
```
npm start
```

You can access your app at 
```
http://localhost:9000/app/
```
