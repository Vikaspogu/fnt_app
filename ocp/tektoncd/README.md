# Tekton

## Concepts

In order to create a pipeline, one does the following:

- Create custom or install existing reusable Tasks
- Create a Pipeline and PipelineResources to define your application's delivery pipeline
- Create a PipelineRun to instantiate and invoke the pipeline

## Installing Tekton on Openshift

### Install Tekton pipeline

Login as a user with `cluster-admin` privileges

```bash
oc new-project tekton-pipelines
oc adm policy add-scc-to-user anyuid -z tekton-pipelines-controller
oc apply --filename https://storage.googleapis.com/tekton-releases/latest/release.yaml
```

### Install dashboard

```bash
curl -L https://github.com/tektoncd/dashboard/releases/download/v0/gcr-tekton-dashboard.yaml | oc apply -f -

```

Expose `tekton-dashboard` service as a route

```bash
oc expose service tekton-dashboard \
  -n tekton-pipelines \
  --name "tekton-dashboard" \
  --port="http" \
  --hostname=tekton-dashboard.${openshift_master_default_subdomain}
```

### Create pipeline

This pipeline builds image from the source, starts a new rollout

1. Create a new project

```bash
oc new-project fntapp
```

2. Create a service account for running pipelines and enable it to run privileged pods for building images

```bash
oc create serviceaccount pipeline
oc adm policy add-scc-to-user privileged -z pipeline
oc adm policy add-role-to-user edit -z pipeline
```

3. Optionally, create openshift objects(i.e DeploymentConfig, ImageStream, Service, Route)

```bash
oc apply -f fnt-backend-template.yml
```

4. Create a `s2i-go`, `openshift-cli` task. You can find more examples of reusable `task`s in the [Tekton Catalog](https://github.com/tektoncd/catalog) and [OpenShift Catalog](https://github.com/openshift/pipelines-catalog) repositories. 

```bash
oc apply -f https://raw.githubusercontent.com/openshift/pipelines-catalog/master/s2i-go/s2i-go-task.yaml
oc create -f https://raw.githubusercontent.com/tektoncd/catalog/master/openshift-client/openshift-client-task.yaml
```

5. Create pipeline resources

```bash
oc apply -f resources.yml
```

6. Create pipeline, pipelines objective is to build from source and deploy

```bash
oc apply -f fnt-backend-pipeline.yml
```

7. Start pipeline