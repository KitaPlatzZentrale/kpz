output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "aws_lbc_role_arn" {
  value = module.eks.aws_lbc_role_arn
}

output "vpc_id" {
  value = module.vpc.vpc_id
}