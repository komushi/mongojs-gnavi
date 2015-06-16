# gnavi data crawler for mongodb


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
cd mongojs-gnavi
```

Edit the manifest.yml
> ---
> applications:
> - name: mongojs-gnavi
>  memory: 512M
>  instances: 1
>  host: mongojs-gnavi-${random-word}
>  env:
>    GNAVI_ACCESSKEY: # gnavi access key for API,
>    SERVICE_NAME: # your mongodb service


Remember to install [cf cli](https://github.com/cloudfoundry/cli/releases) first. Then, push the application:
```
cf push
```

Start to crawl data with specifying 2 parameters - area & collection
```
curl -X GET -i "http://mongojs-gnavi.<your-cf-app-domain>/api/crawlGnavi?area=PREF46&collection=gnavi"
```
