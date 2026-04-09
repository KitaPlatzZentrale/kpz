output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_certificate_authority_data" {
  description = "EKS cluster certificate authority data (base64 encoded)"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "aws_lbc_role_arn" {
  description = "ARN of the AWS Load Balancer Controller role"
  value       = aws_iam_role.aws_lbc.arn
}