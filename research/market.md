# Research on Market Size, Market Access and Business Opportunity (Berlin)

This notebook is reviewing the market size of Kindertageseinrichtungen (KiTa) in the state region Berlin.

Data provided by the [Statistisches Amt Berlin-Brandenburg](https://www.statistik-berlin-brandenburg.de/) (Statistical Office Berlin-Brandenburg) for the year 2022 will be used to investigate the market size of KiTas in Berlin.

## Data Preparation

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


# Load Hosted Kids by District Data
hosted_kids_per_district = pd.read_csv("./data/berlin/hosted-kids-by-district/index.csv", index_col="district")
kita_slots_per_district = pd.read_csv("./data/berlin/kita-slots-by-district/index.csv", index_col="district")
kitas_by_district = pd.read_csv("./data/berlin/kitas-by-district/index.csv", index_col="district")
```

## Introduction

The market size of Kitas in Berlin is defined as the number of kids that are hosted in Kitas in Berlin. This data research approaches an individual kita slot as a market size variable. A secondary market size variable is the number of kids that are in need of a kita slot.

The market size will be investigated on a district level. The market size of the whole state region Berlin will be calculated by summing up the market size of all districts.

Simulations will be performed to determine the neccessary access to the market to reach a financial breakeven point. For these simulations, access to a kita slot will be defined as a primary market access variable. These simulations will be held on a Berlin-wide, as well as a district level. Investigating the market access on multiple levels will allow to prioritize the districts with the highest market access potential.

The business opportunity is

## Data

The data is indexed by the districts in Berlin.

## Market Size
