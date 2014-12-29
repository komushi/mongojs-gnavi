# angular-gnavi 3-tier using express

## Live Demo
[DEMO](http://angular-gnavi-express.herokuapp.com/)

## Screenshots

### 都道府県
![都道府県](https://github.com/komushi/angular-gnavi-express/raw/master/images/prefs.png)

### エリア
![エリア](https://github.com/komushi/angular-gnavi-express/raw/master/images/areas.png)

### カテゴリ
![カテゴリ](https://github.com/komushi/angular-gnavi-express/raw/master/images/cats.png)

### エリア対カテゴリ
![エリア対カテゴリ](https://github.com/komushi/angular-gnavi-express/raw/master/images/areasCats.png)

### カテゴリ対エリア
![カテゴリ対エリア](https://github.com/komushi/angular-gnavi-express/raw/master/images/catsAreas.png)

## DataSource

[ぐるなびWebサービス](http://api.gnavi.co.jp)

### 都道府県

```
http://api.gnavi.co.jp/ver1/PrefSearchAPI/?keyid=<your_api_key>&format=json
```

```
{"pref": [
    {
        "pref_code": "PREF01",
        "pref_name": "北海道",
        "area_code": "AREA150"
    },
    {
        "pref_code": "PREF02",
        "pref_name": "青森県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF03",
        "pref_name": "岩手県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF04",
        "pref_name": "宮城県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF05",
        "pref_name": "秋田県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF06",
        "pref_name": "山形県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF07",
        "pref_name": "福島県",
        "area_code": "AREA160"
    },
    {
        "pref_code": "PREF08",
        "pref_name": "茨城県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF09",
        "pref_name": "栃木県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF10",
        "pref_name": "群馬県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF11",
        "pref_name": "埼玉県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF12",
        "pref_name": "千葉県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF13",
        "pref_name": "東京都",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF14",
        "pref_name": "神奈川県",
        "area_code": "AREA110"
    },
    {
        "pref_code": "PREF15",
        "pref_name": "新潟県",
        "area_code": "AREA170"
    },
    {
        "pref_code": "PREF16",
        "pref_name": "富山県",
        "area_code": "AREA170"
    },
    {
        "pref_code": "PREF17",
        "pref_name": "石川県",
        "area_code": "AREA170"
    },
    {
        "pref_code": "PREF18",
        "pref_name": "福井県",
        "area_code": "AREA170"
    },
    {
        "pref_code": "PREF19",
        "pref_name": "山梨県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF20",
        "pref_name": "長野県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF21",
        "pref_name": "岐阜県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF22",
        "pref_name": "静岡県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF23",
        "pref_name": "愛知県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF24",
        "pref_name": "三重県",
        "area_code": "AREA130"
    },
    {
        "pref_code": "PREF25",
        "pref_name": "滋賀県",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF26",
        "pref_name": "京都府",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF27",
        "pref_name": "大阪府",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF28",
        "pref_name": "兵庫県",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF29",
        "pref_name": "奈良県",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF30",
        "pref_name": "和歌山県",
        "area_code": "AREA120"
    },
    {
        "pref_code": "PREF31",
        "pref_name": "鳥取県",
        "area_code": "AREA180"
    },
    {
        "pref_code": "PREF32",
        "pref_name": "島根県",
        "area_code": "AREA180"
    },
    {
        "pref_code": "PREF33",
        "pref_name": "岡山県",
        "area_code": "AREA180"
    },
    {
        "pref_code": "PREF34",
        "pref_name": "広島県",
        "area_code": "AREA180"
    },
    {
        "pref_code": "PREF35",
        "pref_name": "山口県",
        "area_code": "AREA180"
    },
    {
        "pref_code": "PREF36",
        "pref_name": "徳島県",
        "area_code": "AREA190"
    },
    {
        "pref_code": "PREF37",
        "pref_name": "香川県",
        "area_code": "AREA190"
    },
    {
        "pref_code": "PREF38",
        "pref_name": "愛媛県",
        "area_code": "AREA190"
    },
    {
        "pref_code": "PREF39",
        "pref_name": "高知県",
        "area_code": "AREA190"
    },
    {
        "pref_code": "PREF40",
        "pref_name": "福岡県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF41",
        "pref_name": "佐賀県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF42",
        "pref_name": "長崎県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF43",
        "pref_name": "熊本県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF44",
        "pref_name": "大分県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF45",
        "pref_name": "宮崎県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF46",
        "pref_name": "鹿児島県",
        "area_code": "AREA140"
    },
    {
        "pref_code": "PREF47",
        "pref_name": "沖縄県",
        "area_code": "AREA200"
    }
]}
```

### エリア

```
http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=<your_api_key>&format=json
```

```
{"area": [
    {
        "area_code": "AREA110",
        "area_name": "関東"
    },
    {
        "area_code": "AREA120",
        "area_name": "関西"
    },
    {
        "area_code": "AREA130",
        "area_name": "中部"
    },
    {
        "area_code": "AREA140",
        "area_name": "九州"
    },
    {
        "area_code": "AREA150",
        "area_name": "北海道"
    },
    {
        "area_code": "AREA160",
        "area_name": "東北"
    },
    {
        "area_code": "AREA170",
        "area_name": "北陸"
    },
    {
        "area_code": "AREA180",
        "area_name": "中国"
    },
    {
        "area_code": "AREA190",
        "area_name": "四国"
    },
    {
        "area_code": "AREA200",
        "area_name": "沖縄"
    }
]}
```

### カテゴリ

```
http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=<your_api_key>&format=json
```

```
{"category_l": [
    {
        "category_l_code": "RSFST09000",
        "category_l_name": "居酒屋"
    },
    {
        "category_l_code": "RSFST02000",
        "category_l_name": "日本料理・郷土料理"
    },
    {
        "category_l_code": "RSFST03000",
        "category_l_name": "すし・魚料理・シーフード"
    },
    {
        "category_l_code": "RSFST04000",
        "category_l_name": "鍋"
    },
    {
        "category_l_code": "RSFST05000",
        "category_l_name": "焼肉・ホルモン"
    },
    {
        "category_l_code": "RSFST06000",
        "category_l_name": "焼き鳥・肉料理・串料理"
    },
    {
        "category_l_code": "RSFST01000",
        "category_l_name": "和食"
    },
    {
        "category_l_code": "RSFST07000",
        "category_l_name": "お好み焼き・粉物"
    },
    {
        "category_l_code": "RSFST08000",
        "category_l_name": "ラーメン・麺料理"
    },
    {
        "category_l_code": "RSFST14000",
        "category_l_name": "中華"
    },
    {
        "category_l_code": "RSFST11000",
        "category_l_name": "イタリアン・フレンチ"
    },
    {
        "category_l_code": "RSFST13000",
        "category_l_name": "洋食"
    },
    {
        "category_l_code": "RSFST12000",
        "category_l_name": "欧米・各国料理"
    },
    {
        "category_l_code": "RSFST16000",
        "category_l_name": "カレー"
    },
    {
        "category_l_code": "RSFST15000",
        "category_l_name": "アジア・エスニック料理"
    },
    {
        "category_l_code": "RSFST17000",
        "category_l_name": "オーガニック・創作料理"
    },
    {
        "category_l_code": "RSFST10000",
        "category_l_name": "ダイニングバー・バー・ビアホール"
    },
    {
        "category_l_code": "RSFST21000",
        "category_l_name": "お酒"
    },
    {
        "category_l_code": "RSFST18000",
        "category_l_name": "カフェ・スイーツ"
    },
    {
        "category_l_code": "RSFST19000",
        "category_l_name": "宴会・カラオケ・エンターテイメント"
    },
    {
        "category_l_code": "RSFST20000",
        "category_l_name": "ファミレス・ファーストフード"
    },
    {
        "category_l_code": "RSFST90000",
        "category_l_name": "その他の料理"
    }
]}
```

### レストラン

```
http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=<your_api_key>&category_l=RSFST09000&area=AREA110&hit_per_page=1&format=json
```

```
{
    "total_hit_count": "31962",
    "hit_per_page": "1",
    "page_offset": "1",
    "rest": {
        "@attributes": {"order": "0"},
        "id": "g519405",
        "update_date": "2014-07-27 16:26:47",
        "name": "地下のワインセラー事業部",
        "name_kana": "チカノワインセラージギョウブ",
        "latitude": "35.606658",
        "longitude": "139.672983",
        "category": "魚介鉄板焼きとガブ飲み",
        "url": "http://r.gnavi.co.jp/g519405/?ak=%2BGVSYpwisaqsQOlTvCA8JqO6SvwUmnN0KwxOfDPnFd4%3D",
        "url_mobile": "http://mobile.gnavi.co.jp/shop/g519405/?ak=%2BGVSYpwisaqsQOlTvCA8JqO6SvwUmnN0KwxOfDPnFd4%3D",
        "image_url": {
            "shop_image1": "http://apicache.gnavi.co.jp/image/rest/index.php?img=g519405v.jpg&sid=g519405",
            "shop_image2": "http://apicache.gnavi.co.jp/image/rest/index.php?img=g519405l.jpg&sid=g519405",
            "qrcode": "http://r.gnst.jp/tool/qr/?id=g519405&q=6"
        },
        "address": "〒152-0035 東京都目黒区自由が丘1-24-8 フェリ・ド・フルールB1",
        "tel": "03-5701-0528",
        "fax": "03-5701-0528",
        "opentime": "月～土 17:30～24:30(L.O.24:00)<BR>日・祝日 16:30～23:00(L.O.22:30),",
        "holiday": "無",
        "access": {
            "line": "東急東横線",
            "station": "自由が丘駅",
            "station_exit": {},
            "walk": "3",
            "note": {}
        },
        "pr": {
            "pr_short": "6/14（土）オープン！その日の魚介をシンプルに焼き上げる、自慢の鉄板がお出迎え！ 今宵もがぶ飲みワインがトマリマセン！",
            "pr_long": "毎朝仕入れた新鮮素材を、シンプルに鉄板で！\n魚介中心の鉄板焼きのお相手は、世界中から選りすぐった【2500円】、【3500円】、【4500円】の均一ワイン。\nもちろん、ちょっと贅沢な日に飲みたい、プレミアムな一本も各種ご用意しております。\nワインが進む無国籍な料理たちも、皆様をお待ちしてます！\n個室もいろいろ！様々なシーンで、がぶ飲みワインをお楽しみ下さい。"
        },
        "code": {
            "areacode": "AREA110",
            "areaname": "関東",
            "prefcode": "PREF13",
            "prefname": "東京都",
            "areaname_s": "自由が丘",
            "category_code_l": [
                "RSFST17000",
                "RSFST09000"
            ],
            "category_name_l": [
                "オーガニック・創作料理",
                "居酒屋"
            ],
            "category_code_s": [
                "RSFST17005",
                "RSFST09004"
            ],
            "category_name_s": [
                "無国籍料理",
                "居酒屋"
            ]
        },
        "equipment": "個室あり,宴会用飲み放題メニューあり,ソフトバンク,NTT ドコモ,au,23時以降も食事ができる,お子様連れ歓迎,可,",
        "budget": "3500",
        "flags": {
            "mobile_site": "1",
            "mobile_coupon": "1",
            "pc_coupon": "1"
        }
    }
}
```

## Getting Started

All you need to do is to clone this repository,
```
git clone https://github.com/komushi/angular-gnavi
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
