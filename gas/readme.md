## 手順

### Claspの準備・ログイン

```sh
cd gas/
docker build -t clasp .
touch .clasprc.json
./clasp login --no-localhost # プロンプトに従う
```

### スクリプトのアップロード

```sh
./clasp create --title "Example" --type sheets --rootDir src/
mv ./src/.clasp.json ./ # clasp v2.4.1の不具合?でrootDir内にjsonファイルが作成されてしまうため、正しいと思われる位置に移動する
./clasp push
```

### GCPプロジェクトの設定

[GCPプロジェクトの作成](/gcp/readme.md)

GCPプロジェクトを作成した後、GASのエディタ画面を開き、`プロジェクトの設定` -> `Google Cloud Platform (GCP) プロジェクト` -> `プロジェクトを変更` を選び、プロジェクト番号を入力し設定する

### スクリプトプロパティの設定

`以前のエディタを使用` から、`ファイル` -> `プロジェクトのプロパティ` -> `スクリプトのプロパティ` を選び、次の項目を設定する:

| 項目名 | プロパティ名 | 説明 |
| ----- | ---------- | ---- |
| プロジェクトID | projectId | GCPのプロジェクトID |
| リージョン | region | Cloud Tasksのキューが配置されているリージョン |
| キュー名 | queueName | Cloud Tasksのキューの名前 |
| ワーカーURL | workerUrl | Cloud RunサービスのURL |
| デプロイメントID | deploymentId | GASのデプロイID<br>*後述のデプロイの後に設定する* |
| サービスアカウントEmail | serviceAccountEmail | Cloud Runサービスを実行する権限を持つサービスアカウントのEmailアドレス |

### スクリプトのデプロイ

```sh
./clasp deploy
```

デプロイされたら、GASのエディタ画面を開き、デプロイIDをスクリプトのプロパティに設定する

#### 再デプロイ時の注意点

GASのURL(デプロイID)を固定するため、次の手順でデプロイする:

```sh
./clasp deploy -i ${DEPLOYMENT_ID}
```
