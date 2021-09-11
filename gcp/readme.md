## 手順

### gcloud CLIの準備・ログイン

```sh
cd gcp/
docker run -ti --name gcloud-config google/cloud-sdk:slim gcloud auth login # プロンプトに従う

docker run --rm -ti --volumes-from gcloud-config -v "$(pwd):/app" -w "/app" google/cloud-sdk:slim # コンテナに入る
```

### GCPプロジェクトの作成

```sh
# コンテナ内

gcloud projects create --name "gas-cloud-run-example"

gcloud config set project ${PROJECT_ID}
gcloud config set run/region asia-northeast1
```

GCP Webコンソールを開き、作成されたプロジェクトの課金を有効にする

### Cloud Tasksキューの作成

```sh
# コンテナ内

gcloud app create --region=asia-northeast1
gcloud tasks queues create "example-queue"
```

### Cloud Runサービスの作成

```sh
# コンテナ内

# イメージのビルド
gcloud builds submit --tag "gcr.io/${PROJECT_ID}/example-image"

# サービスの作成
gcloud run deploy "example-service" \
    --image "gcr.io/${PROJECT_ID}/example-image" \
    --no-allow-unauthenticated

# サービスアカウントの作成と起動権限の付与
gcloud iam service-accounts create "example-invoker" \
    --display-name="Cloud Run invoker"
gcloud run services add-iam-policy-binding "example-service" \
    --member="serviceAccount:example-invoker@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role=roles/run.invoker
```

### OAuth同意画面の設定

GCP Webコンソールで設定する。必須項目だけ埋め、スコープの追加は不要。ユーザーの種類を`外部`にした場合、テストユーザーに自分のメールアドレス(GCPプロジェクトのオーナー)を追加する
