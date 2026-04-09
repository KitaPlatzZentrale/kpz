data "tls_certificate" "eks" {
    url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

data "aws_iam_policy_document" "aws_lbc_assume_role" {
    statement {
      effect = "Allow"
      actions = ["sts:AssumeRoleWithWebIdentity"]
      principals {
        type = "Federated"
        identifiers = [aws_iam_openid_connect_provider.eks.arn]
      }
      condition {
        test = "StringEquals"
        variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"
        values = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
      }
    }
}