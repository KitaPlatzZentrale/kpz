module "vpc" {
  source      = "../../modules/networking/vpc"
  environment = var.environment
}

module "eks" {
  source              = "../../modules/eks"
  environment         = var.environment
  cluster_name        = "kpz-${var.environment}-eks-cluster"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  public_subnet_ids   = module.vpc.public_subnet_ids
  instance_type       = "t3.small"
  desired_capacity    = 1
  max_size            = 2
  min_size            = 1
  eks_cluster_version = "1.31"
}