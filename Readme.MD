

## Deploy eks and jupyterhub

### First install [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) , [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and [helm](https://helm.sh/docs/intro/install/)
### Clone to repo with 
- `git clone https://github.com/medicharlachiranjeevi/jupyterhub_to_eks.git`
### To deploy Eks cluster in aws
 - `eksctl create cluster -f ./cluster.yml`

### To genrate a secretToken add it in values.yaml in place `<***token***>` 
- `openssl rand -hex 32`
### To add ebs Driver for eks
- `kubectl apply -k "github.com/kubernetes-sigs/aws-ebs-csi-driver/deploy/kubernetes/overlays/stable/?ref=master"`

### To deploy autoscaler in eks
- `kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml`

### Edit deployment add your clustername for autoscaling group
 ```
 KUBE_EDITOR="nano" kubectl -n kube-system edit deployment.apps/cluster-autoscaler
```
Edit the  `cluster-autoscaler`  container command to replace  `<YOUR CLUSTER NAME>`  (including  `<>`) with your cluster's name, and add the following options.

-   `--balance-similar-node-groups`
    
-   `--skip-nodes-with-system-pods=false`
```
spec:

containers:

- command:

- ./cluster-autoscaler

- --v=4

- --stderrthreshold=info

- --cloud-provider=aws

- --skip-nodes-with-local-storage=false

- --expander=least-waste

- --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/<YOUR CLUSTER NAME>

- --balance-similar-node-groups

- --skip-nodes-with-system-pods=false

```


### To deploy  jupyterhub using helm in eks
- `helm repo add jupyterhub https://jupyterhub.github.io/helm-chart/`
- `helm repo update`
- `helm install jupyterhub jupyterhub/jupyterhub --values values.yml --namespace=jupiterhub --create-namespace`
#### For more about authenticators got to [documentation](https://zero-to-jupyterhub.readthedocs.io/en/latest/jupyterhub/customizing/user-management.html#authenticating-users) of jupyterhub
### to get public domain 
- `kubectl --namespace=jupiterhub get svc proxy-public`
### Reference from [arhea](https://www.arhea.net/posts/2020-06-18-jupyterhub-amazon-eks.html), [amazon](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html#ca-deploy), [Zero To Jupyterhub](https://zero-to-jupyterhub.readthedocs.io/en/latest/)
